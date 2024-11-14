'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionsImportsRows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      TransactionsImportId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'TransactionsImports', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
        allowNull: false,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Expenses', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Orders', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      sourceId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDismissed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3), 
        allowNull: false,
      },
      isUnique: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rawValue: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TransactionsImportsRows');
  },
};
