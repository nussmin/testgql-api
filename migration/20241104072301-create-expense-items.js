'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ExpenseItems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        validate: {
          len: [3, 3],
          notEmpty: true,
          isIn: {
            args: [
              [
                'USD',
                'AED',
                'AFN',
                'ALL',
                'AMD',
                'ANG',
                'AOA',
                'ARS',
                'AUD',
                'AWG',
                'AZN',
                'BAM',
                'BBD',
                'BDT',
                'BGN',
                'BIF',
                'BMD',
                'BND',
                'BOB',
                'BRL',
                'BSD',
                'BWP',
                'BYN',
                'BZD',
                'CAD',
                'CDF',
                'CHF',
                'CLP',
                'CNY',
                'COP',
                'CRC',
                'CVE',
                'CZK',
                'DJF',
                'DKK',
                'DOP',
                'DZD',
                'EGP',
                'ETB',
                'EUR',
                'FJD',
                'FKP',
                'GBP',
                'GEL',
                'GIP',
                'GMD',
                'GNF',
                'GTQ',
                'GYD',
                'HKD',
                'HNL',
                'HRK',
                'HTG',
                'HUF',
                'IDR',
                'ILS',
                'INR',
                'ISK',
                'JMD',
                'JPY',
                'KES',
                'KGS',
                'KHR',
                'KMF',
                'KRW',
                'KYD',
                'KZT',
                'LAK',
                'LBP',
                'LKR',
                'LRD',
                'LSL',
                'MAD',
                'MDL',
                'MGA',
                'MKD',
                'MMK',
                'MNT',
                'MOP',
                'MRO',
                'MUR',
                'MVR',
                'MWK',
                'MXN',
                'MYR',
                'MZN',
                'NAD',
                'NGN',
                'NIO',
                'NOK',
                'NPR',
                'NZD',
                'PAB',
                'PEN',
                'PGK',
                'PHP',
                'PKR',
                'PLN',
                'PYG',
                'QAR',
                'RON',
                'RSD',
                'RUB',
                'RWF',
                'SAR',
                'SBD',
                'SCR',
                'SEK',
                'SGD',
                'SHP',
                'SLL',
                'SOS',
                'SRD',
                'STD',
                'SZL',
                'THB',
                'TJS',
                'TOP',
                'TRY',
                'TTD',
                'TWD',
                'TZS',
                'UAH',
                'UGX',
                'UYU',
                'UZS',
                'VND',
                'VUV',
                'WST',
                'XAF',
                'XCD',
                'XOF',
                'XPF',
                'YER',
                'ZAR',
                'ZMW',
              ],
            ], // Replace with `SUPPORTED_CURRENCIES` in actual implementation
            msg: 'Currency not supported',
          },
        },
      },
      expenseCurrencyFxRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          min: 0.00000001,
        },
      },
      expenseCurrencyFxRateSource: {
        type: Sequelize.ENUM('OPENCOLLECTIVE', 'PAYPAL', 'WISE', 'USER'),
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING(1200),
        allowNull: true,
        validate: {
          len: [0, 2048], // assuming MAX_UPLOADED_FILE_URL_LENGTH is 2048
        },
      },
      description: {
        type: Sequelize.TEXT,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
      incurredAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      ExpenseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Expenses', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ExpenseItems');
    // Drop ENUM type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ExpenseItems_expenseCurrencyFxRateSource";');
  },
};
