'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /*references: {
          model: 'Collectives',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      UserTokenId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'UserTokens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      TransactionId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Transactions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Expenses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */
        allowNull: true,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', */ 
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Activities');
  },
};

