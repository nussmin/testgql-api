'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: false,
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Expenses',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      HostApplicationId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'HostApplications',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Orders',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      UpdateId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Updates',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      ConversationId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      html: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('COMMENT', 'PRIVATE_NOTE'),
        defaultValue: 'COMMENT',
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  },
};

