'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserTwoFactorMethods', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['TOTP', 'YUBIKEY_OTP', 'WEBAUTHN']], // Use actual values from TwoFactorMethod enum
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [0, 50],
        },
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',*/
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

    // Add indexes if needed
    await queryInterface.addIndex('UserTwoFactorMethods', ['UserId']);
    await queryInterface.addIndex('UserTwoFactorMethods', ['method']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserTwoFactorMethods');
  },
};
