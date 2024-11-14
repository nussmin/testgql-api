'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ENUM type for the `interval` column based on `RecurringExpenseIntervals`
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_RecurringExpenses_interval" AS ENUM('day', 'week', 'month', 'quarter', 'year');
    `);

    await queryInterface.createTable('RecurringExpenses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',*/ 
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      interval: {
        type: Sequelize.ENUM('day', 'week', 'month', 'quarter', 'year'),
        allowNull: false,
      },
      lastDraftedAt: {
        type: Sequelize.DATE,
      },
      endsAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('RecurringExpenses');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_RecurringExpenses_interval";`);
  },
};
