'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM types for Expense type and feesPayer
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Expenses_type" AS ENUM('INVOICE', 'RECEIPT', 'CHARGE', 'UNCLASSIFIED');
      CREATE TYPE "enum_Expenses_feesPayer" AS ENUM('COLLECTIVE', 'PAYEE');
    `);

    await queryInterface.createTable('Expenses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',*/
        allowNull: false,
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' }, */
        allowNull: true,
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      PayoutMethodId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'PayoutMethods', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      PaymentMethodId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'PaymentMethods', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      VirtualCardId: {
        type: Sequelize.STRING,
        /* references: { model: 'VirtualCards', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      AccountingCategoryId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'AccountingCategories', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      RecurringExpenseId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'RecurringExpenses', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      payeeLocation: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      legacyPayoutMethod: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'manual',
        validate: {
          isIn: [['paypal', 'manual', 'donation', 'other']],
        },
      },
      privateMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      invoiceInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lastEditedById: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'PENDING',
        allowNull: false,
        validate: {
          isIn: [['PENDING', 'APPROVED', 'PAID', 'REJECTED', 'PROCESSING', 'ERROR', 'UNVERIFIED', 'SPAM', 'DRAFT']],
        },
      },
      type: {
        type: Sequelize.ENUM('INVOICE', 'RECEIPT', 'CHARGE', 'UNCLASSIFIED'),
        allowNull: false,
        defaultValue: 'UNCLASSIFIED',
      },
      feesPayer: {
        type: Sequelize.ENUM('COLLECTIVE', 'PAYEE'),
        allowNull: false,
        defaultValue: 'COLLECTIVE',
      },
      incurredAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      onHold: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: async queryInterface => {
    // Drop table and ENUMs
    await queryInterface.dropTable('Expenses');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Expenses_type";
      DROP TYPE IF EXISTS "enum_Expenses_feesPayer";
    `);
  },
};
