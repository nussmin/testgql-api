import '../server/env';

import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { cwd } from 'process';
import readline from 'readline';

import { Command } from 'commander';
import { round } from 'lodash';
import moment from 'moment';
import type { Sequelize } from 'sequelize';
import { Model as SequelizeModel, ModelStatic } from 'sequelize';

import { loaders } from '../server/graphql/loaders';
import { getMigrationsHash, traverse } from '../server/lib/import-export/export';
import {
  mergeRecords,
  MODELS_ARRAY,
  populateDefaultValues,
  remapPKs,
  resetModelsSequences,
} from '../server/lib/import-export/import';
import { PartialRequest } from '../server/lib/import-export/types';
import logger from '../server/lib/logger';
import { md5 } from '../server/lib/utils';
import models, { sequelize } from '../server/models';

const program = new Command();

const exec = cmd => {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    logger.error(e);
  }
};

program.command('dump [recipe] [as_user] [env_file]').action(async (recipe, asUser, env) => {
  if (!sequelize.config.username.includes('readonly')) {
    logger.error('Remote must be connected with read-only user!');
    process.exit(1);
  } else if (!asUser) {
    logger.error('as_user is required');
    process.exit(1);
  }

  if (!recipe || (recipe && !env)) {
    logger.info('Using default recipe...');
    recipe = './smart-dump/defaultRecipe.js';
  }

  // Prepare req object
  const remoteUser = await models.User.findOne({ include: [{ association: 'collective', where: { slug: asUser } }] });
  const req: PartialRequest = { remoteUser, loaders: loaders({ remoteUser }) };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { entries, defaultDependencies } = require(recipe);
  const parsed = {};
  const date = new Date().toISOString().substring(0, 10);
  const hash = md5(JSON.stringify({ entries, defaultDependencies, date })).slice(0, 5);
  const migrationsHash = await getMigrationsHash();
  const seenModelRecords: Set<string> = new Set();
  const tempDumpDir = fs.mkdtempSync(path.join(os.tmpdir(), `oc-export-${hash}`));
  logger.info(`>>> Temp directory: ${tempDumpDir}`);

  const gitRevision = execSync('git describe --always --abbrev=0 --match "NOT A TAG" --dirty="*"').toString().trim();
  fs.writeFileSync(
    `${tempDumpDir}/metadata.json`,
    JSON.stringify({
      gitRevision,
      date,
      asUser,
      hash,
      migrationsHash,
      recipe: require(recipe),
    }),
  );

  let start = new Date();

  logger.info('>>> Dumping Schema...');
  exec(`pg_dump -csOx --if-exists $PG_URL > ${tempDumpDir}/schema.sql`);
  exec(
    `pg_dump --schema=public --table=public.\\"SequelizeMeta\\" --data-only $PG_URL >> ${tempDumpDir}/migrations.sql`,
  );
  logger.info(`>>> Schema Dumped in ${moment(start).fromNow(true)}`);

  start = new Date();
  logger.info(`>>> Dumping... to ${tempDumpDir}/data.jsonl`);
  const dumpFile = fs.createWriteStream(`${tempDumpDir}/data.jsonl`);
  let maxmemoryused = 0;
  const clearCache = setInterval(() => {
    const memoryused = round(process.memoryUsage.rss() / 1e6, 2);
    maxmemoryused = Math.max(memoryused, maxmemoryused);
    logger.info(
      `>>> Seen ${seenModelRecords.size} records, using ${memoryused}MB of memory. Max used: ${maxmemoryused}MB`,
    );
    req.loaders.autogenerated.reset();
  }, 30000);
  for (const entry of entries) {
    logger.info(`>>> Traversing DB for entry ${entries.indexOf(entry) + 1}/${entries.length}...`);
    await traverse({ ...entry, defaultDependencies, parsed }, req, async ei => {
      const modelRecordKey = `${ei.model}.${ei.id}`;
      if (!seenModelRecords.has(modelRecordKey)) {
        dumpFile.write(JSON.stringify(ei) + os.EOL);
        seenModelRecords.add(modelRecordKey);
      }
    });
  }
  clearInterval(clearCache);
  dumpFile.close();
  logger.info(
    `>>> Dumped! ${seenModelRecords.size} records in ${moment(start).fromNow(true)}, max memory used: ${maxmemoryused}MB`,
  );

  logger.info(`>>> Ziping export to... dbdumps/${date}.${hash}.zip`);
  exec(`CUR_DIR=$PWD; cd ${tempDumpDir}; zip -r $CUR_DIR/dbdumps/${date}.${hash}.zip .; cd $CUR_DIR`);
  logger.info(`>>> Done! See dbdumps/${date}.${hash}.zip`);
  sequelize.close();
});

program.command('restore <file>').action(async file => {
  const database = process.env.PG_DATABASE;
  if (!database) {
    logger.error('PG_DATABASE is not set!');
    process.exit(1);
  } else if (sequelize.config.database !== database) {
    logger.error(`Sequelize is not connected to target ${database}!`);
    process.exit(1);
  }

  const importBundleAbsolutePath = path.resolve(cwd(), file);
  const tempImportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-import-'));
  logger.info(`>>> Temp directory: ${tempImportDir}`);
  exec(`CUR_DIR=$PWD; cd ${tempImportDir}; unzip ${importBundleAbsolutePath}; cd $CUR_DIR`);

  const importMetadata = JSON.parse(fs.readFileSync(path.join(tempImportDir, 'metadata.json')).toString());
  logger.info(
    `>>> Import metadata... date: ${importMetadata.date}, hash: ${importMetadata.hash}, gitRevision: ${importMetadata.gitRevision}`,
  );

  let start = new Date();
  logger.info('>>> Recreating DB...');
  exec(`dropdb ${database}`);
  exec(`createdb ${database}`);
  exec(`psql -d ${database} -c 'GRANT ALL PRIVILEGES ON DATABASE ${database} TO opencollective'`);
  exec(`psql -h localhost -U opencollective ${database} < ${tempImportDir}/schema.sql`);
  exec(`psql -h localhost -U opencollective ${database} < ${tempImportDir}/migrations.sql`);
  logger.info(`>>> DB Created! in ${moment(start).fromNow(true)}`);

  const transaction = await (sequelize as Sequelize).transaction();

  const modelsArray: ModelStatic<SequelizeModel>[] = Object.values(models);
  let err;
  let count = 0;
  try {
    for (const model of modelsArray) {
      logger.info(`>>> Disabling triggers on table ${model.getTableName()}`);
      await sequelize.query(`ALTER TABLE "${model.getTableName()}" DISABLE TRIGGER ALL;`, { transaction });
    }

    logger.info(`>>> Opening file ${tempImportDir}/schema.sql`);
    const dataFile = path.join(tempImportDir, 'data.jsonl');
    const fileStream = fs.createReadStream(dataFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    start = new Date();
    logger.info('>>> Inserting Data...');

    for await (const line of rl) {
      let row = JSON.parse(line);

      // Since we use `raw: true` in `Model.create`, we need to manually set default values when needed
      row = populateDefaultValues(row);

      const model: ModelStatic<SequelizeModel> = models[row.model];
      await model.create(row, {
        transaction,
        validate: false,
        hooks: false,
        silent: true,
        logging: false,
        raw: true,
        ignoreDuplicates: true,
        returning: false,
      });
      count++;
    }
  } catch (e) {
    err = e;
  } finally {
    if (!err) {
      logger.info(`>>> Data inserted! ${count} records in ${moment(start).fromNow(true)}`);
      for (const model of modelsArray) {
        logger.info(`>>> Reenabling triggers on table ${model.getTableName()}`);
        await sequelize.query(`ALTER TABLE "${model.getTableName()}" ENABLE TRIGGER ALL;`, { transaction });
      }

      logger.info(`>>> Commiting transaction`);
      await transaction.commit();
    } else {
      console.error(err);
      logger.info(`>>> Rollback transaction`);
      transaction.rollback();
    }
  }

  logger.info('>>> Refreshing Materialized Views...');
  await sequelize.query(`REFRESH MATERIALIZED VIEW "TransactionBalances"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveBalanceCheckpoint"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveTransactionStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveTagStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "ExpenseTagStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "HostMonthlyTransactions"`);

  await resetModelsSequences(modelsArray);

  logger.info('>>> Done!');
  sequelize.close();
});

program.command('merge <file>').action(async file => {
  const database = process.env.PG_DATABASE;
  if (!database) {
    logger.error('PG_DATABASE is not set!');
    process.exit(1);
  } else if (sequelize.config.database !== database) {
    logger.error(`Sequelize is not connected to target ${database}!`);
    process.exit(1);
  }

  const importBundleAbsolutePath = path.resolve(cwd(), file);
  const tempImportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-import-'));
  logger.info(`>>> Temp directory: ${tempImportDir}`);
  exec(`CUR_DIR=$PWD; cd ${tempImportDir}; unzip ${importBundleAbsolutePath}; cd $CUR_DIR`);

  const importMetadata = JSON.parse(fs.readFileSync(path.join(tempImportDir, 'metadata.json')).toString());
  logger.info(
    `>>> Import metadata... date: ${importMetadata.date}, hash: ${importMetadata.hash}, gitRevision: ${importMetadata.gitRevision}`,
  );

  const migrationsHash = await getMigrationsHash();
  if (importMetadata.migrationsHash !== migrationsHash) {
    logger.error(
      `Migrations hash mismatch! Expected existing SequelizeMeta table hash ${migrationsHash} to match exported metadata ${importMetadata.migrationsHash}. Make sure to run migrations before importing.`,
    );
    process.exit(1);
  }

  const transaction = await (sequelize as Sequelize).transaction();
  let err,
    count = 0,
    start;
  try {
    for (const model of MODELS_ARRAY) {
      logger.info(`>>> Disabling triggers on table ${model.getTableName()}`);
      await sequelize.query(`ALTER TABLE "${model.getTableName()}" DISABLE TRIGGER ALL;`, { transaction });
    }

    const dataFile = path.join(tempImportDir, 'data.jsonl');

    // Create a map of indexes to use in the import
    logger.info('>>> Remapping existing IDs...');
    start = new Date();
    const pkMap = await remapPKs(dataFile);
    logger.info(`>>> Remapped IDs in ${moment(start).fromNow(true)}`);

    start = new Date();
    logger.info('>>> Inserting Data...');
    count = await mergeRecords(dataFile, pkMap, transaction);
  } catch (e) {
    err = e;
  } finally {
    if (!err) {
      logger.info(`>>> Data inserted! ${count} records in ${moment(start).fromNow(true)}`);
      for (const model of MODELS_ARRAY) {
        logger.info(`>>> Reenabling triggers on table ${model.getTableName()}`);
        await sequelize.query(`ALTER TABLE "${model.getTableName()}" ENABLE TRIGGER ALL;`, { transaction });
      }

      logger.info(`>>> Commiting transaction`);
      await transaction.commit();
    } else {
      console.error(err);
      logger.info(`>>> Rollback transaction`);
      transaction.rollback();
    }
  }

  logger.info('>>> Refreshing Materialized Views...');
  await sequelize.query(`REFRESH MATERIALIZED VIEW "TransactionBalances"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveBalanceCheckpoint"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveTransactionStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "CollectiveTagStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "ExpenseTagStats"`);
  await sequelize.query(`REFRESH MATERIALIZED VIEW "HostMonthlyTransactions"`);

  logger.info('>>> Done!');
  sequelize.close();
});

program.addHelpText(
  'after',
  `

Use this script to do partial dumps of a DB based on a recipe, to restore a DB from a dump, or to merge data into an existing DB.

Both restore and merge operations require a connection with a superuser role.

Make sure you have a zip and a compatible version of psql (pg_dump, pg_restore, createdb and dropdb) installed.


Examples:

  To export data and DB schema:
  $ npm run script scripts/smart-dump.ts dump ./smart-dump/engineering.ts superuser prod

  To restore the whole DB:
  $ PG_USERNAME=postgres PG_DATABASE=opencollective_prod_snapshot npm run script scripts/smart-dump.ts restore dbdumps/2023-03-21.c5292.zip

  To merge data into an existing DB:
  $ PG_USERNAME=postgres PG_DATABASE=opencollective_prod_snapshot npm run script scripts/smart-dump.ts import dbdumps/2023-03-21.c5292.zip
`,
);

program.parse();
