'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('TransactionsImports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      UploadedFileId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'UploadedFiles', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      ConnectedAccountId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'ConnectedAccounts', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('CSV', 'MANUAL', 'PLAID'),
        allowNull: false,
      },
      settings: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      lastSyncAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('TransactionsImports');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TransactionsImports_type";');
  },
};
