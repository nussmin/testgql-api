'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM type for PayoutMethod type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_PayoutMethods_type" AS ENUM('OTHER', 'PAYPAL', 'BANK_ACCOUNT', 'ACCOUNT_BALANCE', 'CREDIT_CARD');
    `);

    await queryInterface.createTable('PayoutMethods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('OTHER', 'PAYPAL', 'BANK_ACCOUNT', 'ACCOUNT_BALANCE', 'CREDIT_CARD'),
        allowNull: false,
        validate: {
          isIn: [['OTHER', 'PAYPAL', 'BANK_ACCOUNT', 'ACCOUNT_BALANCE', 'CREDIT_CARD']],
        },
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
        /* validate: {
          // Placeholder, as Sequelize's validation functions aren't executed directly in migrations.
          // Actual validation is implemented in the model.
        }, */
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
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isSaved: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
        allowNull: false,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    // Drop table and ENUM type
    await queryInterface.dropTable('PayoutMethods');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_PayoutMethods_type";
    `);
  },
};
