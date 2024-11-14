'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MigrationLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'MIGRATION',
          'MANUAL',
          'MERGE_ACCOUNTS',
          'BAN_ACCOUNTS',
          'MOVE_ORDERS',
          'MOVE_EXPENSES',
          'MODEL_FIX',
        ),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: '{}',
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the ENUM type for `type` to fully revert the migration in PostgreSQL
    await queryInterface.dropTable('MigrationLogs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_MigrationLogs_type";');
  },
};
