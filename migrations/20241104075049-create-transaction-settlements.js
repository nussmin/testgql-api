'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionSettlements', {
      TransactionGroup: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
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
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: Sequelize.ENUM('OWED', 'INVOICED', 'SETTLED'),
        allowNull: false,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Expenses',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('TransactionSettlements');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TransactionSettlements_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TransactionSettlements_kind";');
  },
};
