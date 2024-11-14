'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VirtualCardRequests', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      purpose: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 60],
          notEmpty: true,
        },
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [1, 3000],
          notEmpty: true,
        },
      },
      status: {
        type: Sequelize.ENUM('APPROVED', 'PENDING', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      currency: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      spendingLimitAmount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      spendingLimitInterval: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VirtualCardRequests');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_VirtualCardRequests_status";`
    );
  },
};
