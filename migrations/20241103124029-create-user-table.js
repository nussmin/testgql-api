'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Collectives', // Adjust to the exact table name for Collective
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',*/
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [6, 128],
          isEmail: true,
        },
      },
      emailWaitingForValidation: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      emailConfirmationToken: {
        type: Sequelize.STRING,
        allowNull: true,
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
      confirmedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      newsletterOptIn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      twoFactorAuthToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      yubikeyDeviceId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twoFactorAuthRecoveryCodes: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      changelogViewDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordUpdatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['emailWaitingForValidation'], { unique: true });
    await queryInterface.addIndex('Users', ['CollectiveId']);
    await queryInterface.addIndex('Users', ['lastLoginAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
