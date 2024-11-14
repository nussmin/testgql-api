'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaypalProducts', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
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
        allowNull: true,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      TierId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Tiers', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
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
    await queryInterface.dropTable('PaypalProducts');
  },
};
