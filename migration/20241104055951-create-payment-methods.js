'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM types for `service` and `type` fields based on PAYMENT_METHOD_SERVICES and PAYMENT_METHOD_TYPES
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_PaymentMethods_service" AS ENUM('stripe', 'paypal', 'opencollective', 'bank');
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_PaymentMethods_type" AS ENUM('creditcard', 'bank', 'giftcard', 'prepaid', 'collective');
    `);

    await queryInterface.createTable('PaymentMethods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
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
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      monthlyLimitPerMember: {
        type: Sequelize.INTEGER,
        validate: { min: 0 },
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      service: {
        type: Sequelize.ENUM('stripe', 'paypal', 'opencollective', 'bank'),
        defaultValue: 'stripe',
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('creditcard', 'bank', 'giftcard', 'prepaid', 'collective'),
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
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
      confirmedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      archivedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      initialBalance: {
        type: Sequelize.INTEGER,
        validate: { min: 0 },
        allowNull: true,
      },
      limitedToTags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      batch: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      limitedToHostCollectiveIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      SourcePaymentMethodId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'PaymentMethods',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      saved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('PaymentMethods');
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_PaymentMethods_service";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_PaymentMethods_type";`);
  },
};
