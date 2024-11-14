'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HostApplications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [0, 3000],
        },
      },
      customData: {
        type: Sequelize.JSONB,
        allowNull: true,
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
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HostApplications');
    // Drop ENUM type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_HostApplications_status";');
  },
};
