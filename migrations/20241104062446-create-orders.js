'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM types for the `status` field based on OrderStatus if it is not already created
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Orders_status" AS ENUM('NEW', 'PENDING', 'PAID', 'CANCELLED', 'REJECTED', 'ERROR', 'EXPIRED', 'PAUSED');
    `);

    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Users',
          key: 'id',
        }, 
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
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
      TierId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Tiers',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      quantity: {
        type: Sequelize.INTEGER,
        validate: { min: 1 },
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      totalAmount: {
        type: Sequelize.INTEGER,
        validate: { min: 0 },
        allowNull: false,
      },
      platformTipAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: 0 },
      },
      platformTipEligible: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null,
      },
      taxAmount: {
        type: Sequelize.INTEGER,
        validate: { min: 0 },
      },
      description: {
        type: Sequelize.STRING,
      },
      publicMessage: {
        type: Sequelize.STRING,
      },
      privateMessage: {
        type: Sequelize.STRING,
      },
      SubscriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subscriptions',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      AccountingCategoryId: {
        type: Sequelize.INTEGER,
        /* references: { key: 'id', model: 'AccountingCategories' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      PaymentMethodId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'PaymentMethods',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      processedAt: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM('NEW', 'PENDING', 'PAID', 'CANCELLED', 'REJECTED', 'ERROR', 'EXPIRED', 'PAUSED'),
        defaultValue: 'NEW',
        allowNull: false,
      },
      interval: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Orders');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Orders_status";`);
  },
};
