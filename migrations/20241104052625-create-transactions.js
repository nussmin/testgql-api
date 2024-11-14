'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the ENUM type for TransactionKind
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Transactions_kind" AS ENUM(
        'ADDED_FUNDS',
        'BALANCE_TRANSFER',
        'CONTRIBUTION',
        'EXPENSE',
        'HOST_FEE',
        'HOST_FEE_SHARE',
        'HOST_FEE_SHARE_DEBT',
        'PAYMENT_PROCESSOR_COVER',
        'PAYMENT_PROCESSOR_DISPUTE_FEE',
        'PAYMENT_PROCESSOR_FEE',
        'PLATFORM_FEE',
        'PLATFORM_TIP',
        'PLATFORM_TIP_DEBT',
        'PREPAID_PAYMENT_METHOD',
        'TAX'
      );
    `);

    // Creating the Transactions table
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT'),
        allowNull: false,
      },
      kind: {
        type: Sequelize.ENUM(
          'ADDED_FUNDS',
          'BALANCE_TRANSFER',
          'CONTRIBUTION',
          'EXPENSE',
          'HOST_FEE',
          'HOST_FEE_SHARE',
          'HOST_FEE_SHARE_DEBT',
          'PAYMENT_PROCESSOR_COVER',
          'PAYMENT_PROCESSOR_DISPUTE_FEE',
          'PAYMENT_PROCESSOR_FEE',
          'PLATFORM_FEE',
          'PLATFORM_TIP',
          'PLATFORM_TIP_DEBT',
          'PREPAID_PAYMENT_METHOD',
          'TAX',
        ),
        allowNull: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      hostCurrency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      hostCurrencyFxRate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1,
      },
      amountInHostCurrency: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      platformFeeInHostCurrency: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      hostFeeInHostCurrency: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      paymentProcessorFeeInHostCurrency: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      taxAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      netAmountInCollectiveCurrency: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      TransactionGroup: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      isRefund: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isDebt: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      isDisputed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isInReview: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isInternal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
        allowNull: true,
      },
      clearedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      UsingGiftCardFromCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      OrderId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Orders', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Expenses', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      PaymentMethodId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'PaymentMethods', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      PayoutMethodId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'PayoutMethods', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      RefundTransactionId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Transactions', key: 'id' }, */
        allowNull: true,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('Transactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Transactions_kind";');
  },
};
