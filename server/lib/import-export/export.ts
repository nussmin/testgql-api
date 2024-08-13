import debugLib from 'debug';
import { compact, concat, repeat, set } from 'lodash';
import { DataType } from 'sequelize';

import type { ModelNames, Models } from '../../models';
import models, { Op } from '../../models';
import logger from '../logger';

import { getSanitizers } from './sanitize';
import { PartialRequest } from './types';

const debug = debugLib('export');

type Attributues = {
  allowNull?: boolean;
  field?: string;
  fieldName?: string;
  onDelete?: string;
  onUpdate?: string;
  type: DataType;
  references?: {
    model: string;
    key: string;
  };
};

type Model = {
  name: ModelNames;
  tableName: string;
  getAttributes: () => Record<string, Attributues>;
};

export const buildForeignKeyTree = (models: Models) => {
  const tree: Partial<Record<ModelNames, Partial<Record<ModelNames, string[]>>>> = {};
  const modelsArray = Object.values(models) as Model[];

  modelsArray.forEach(model => {
    const { name: modelName } = model;
    const columns = model.getAttributes();

    Object.values(columns).forEach(column => {
      if (column.references) {
        const referencedModel = modelsArray.find(model => model.tableName === column.references.model);
        if (tree[referencedModel.name]?.[modelName]) {
          tree[referencedModel.name][modelName].push(column.fieldName);
        } else {
          set(tree, `${referencedModel.name}.${modelName}`, [column.fieldName]);
        }
      }
    });
  });

  return tree;
};

const foreignKeys = buildForeignKeyTree(models);

const sanitizers = getSanitizers();

const serialize = async (model: ModelNames, req: PartialRequest, document: InstanceType<Models[ModelNames]>) => {
  const baseValues = { ...document.dataValues, model };
  if (!sanitizers[model]) {
    logger.warn(`No sanitizer found for model ${model}`);
    return baseValues;
  }

  const sanitizedValues = await sanitizers[model](document, req);
  if (sanitizedValues === null) {
    return null; // A null return means the record should be skipped
  }

  return { ...baseValues, ...sanitizedValues };
};

type RecipeItem = {
  model?: ModelNames;
  where?: Record<string, any>;
  order?: Record<string, any>;
  dependencies?: Array<Omit<RecipeItem, 'req'> | string>;
  defaultDependencies?: Record<string, RecipeItem | string>;
  on?: string;
  from?: string;
  limit?: number;
  parsed?: Record<string, Set<number>>;
  depth?: number;
};

type ExportedItem = Record<string, any> & { model: ModelNames; id: number | string };

async function* paginate(model: ModelNames, where: Record<string, any>, order: Record<string, any>, limit: number) {
  let offset = 0;
  let totalCount = 0;
  do {
    const result = await (models[model] as any).findAndCountAll({ where, order, limit, offset });
    totalCount = result.count;
    yield result.rows;
    offset += limit;
  } while (offset < totalCount);
}

export const traverse = async (
  { model, where, order, dependencies, limit = 1000, defaultDependencies = {}, parsed = {}, depth = 1 }: RecipeItem,
  req: PartialRequest,
  callback: (ei: ExportedItem) => Promise<any>,
): Promise<void> => {
  let records;

  if (model && where) {
    if (!where.id && parsed[model]) {
      where.id = { [Op.notIn]: Array.from(parsed[model]) };
    }

    for await (const pageRecords of paginate(model, where, order, limit)) {
      const serializedRecords = await Promise.all(pageRecords.map(record => serialize(model, req, record)));
      records = serializedRecords.filter(Boolean);

      if (!parsed[model]) {
        parsed[model] = new Set(records.map(r => r.id));
      } else {
        records.forEach(r => parsed[model].add(r.id));
      }

      for (const element of records) {
        await callback(element);
      }

      // Inject default dependencies for the model
      dependencies = compact(concat(dependencies, defaultDependencies[model]));
      for (const record of records) {
        const isLast = records.indexOf(record) === records.length - 1;
        debug(`${repeat('  │', depth - 1)}  ${isLast ? '└' : '├'} ${record.model} #${record.id}`);

        const pResults = [];
        for (const dep of dependencies) {
          let where = {};
          // Find dependency using default foreign key tree
          if (typeof dep === 'string') {
            if (foreignKeys[model]?.[dep]) {
              where = { ...where, [Op.or]: foreignKeys[model][dep].map(on => ({ [on]: record.id })) };
              pResults.push(
                traverse(
                  { model: dep as ModelNames, where, defaultDependencies, parsed, depth: depth + 1 },
                  req,
                  callback,
                ),
              );
            } else {
              logger.error(`Foreign key not found for ${model}.${dep}`);
            }
          } else {
            // If the dependency has a custom function
            if (typeof dep.where === 'function') {
              where = dep.where(record);
            }
            // Find dependency which ID from record foreign key
            else if (dep.from && record[dep.from]) {
              where['id'] = record[dep.from];
            }
            // Find dependency which foreign key is equal to the record ID
            else if (dep.on) {
              where[dep.on] = record.id;
            } else {
              continue;
            }
            pResults.push(traverse({ ...dep, where, defaultDependencies, parsed, depth: depth + 1 }, req, callback));
          }
        }
        await Promise.all(pResults);
      }
    }
  }
};
