'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM types for the `kind`, `expensesTypes`, and `appliesTo` columns
    await queryInterface.sequelize.query(`CREATE TYPE "enum_AccountingCategories_kind" AS ENUM('ADDED_FUNDS', 'CONTRIBUTION', 'EXPENSE');`);
    await queryInterface.sequelize.query(`CREATE TYPE "enum_AccountingCategories_expensesTypes" AS ENUM('INVOICE', 'RECEIPT', 'GRANT', 'CHARGE');`);
    await queryInterface.sequelize.query(`CREATE TYPE "enum_AccountingCategories_appliesTo" AS ENUM('HOST', 'HOSTED_COLLECTIVES');`);

    // Create the AccountingCategories table
    await queryInterface.createTable('AccountingCategories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [0, 255],
        },
      },
      friendlyName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      hostOnly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [0, 50000],
        },
      },
      kind: {
        type: Sequelize.ENUM('ADDED_FUNDS', 'CONTRIBUTION', 'EXPENSE'),
        allowNull: true,
      },
      expensesTypes: {
        type: Sequelize.ARRAY(Sequelize.ENUM('INVOICE', 'RECEIPT', 'GRANT', 'CHARGE')),
        allowNull: true,
      },
      appliesTo: {
        type: Sequelize.ENUM('HOST', 'HOSTED_COLLECTIVES'),
        allowNull: false,
        defaultValue: 'HOSTED_COLLECTIVES',
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AccountingCategories');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_AccountingCategories_kind";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_AccountingCategories_expensesTypes";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_AccountingCategories_appliesTo";`);
  },
};

