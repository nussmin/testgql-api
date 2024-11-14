'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM values for the scope
    const oAuthScopesValues = [
      'email',
      'incognito',
      'account',
      'expenses',
      'orders',
      'transactions',
      'virtualCards',
      'updates',
      'conversations',
      'webhooks',
      'host',
      'applications',
      'connectedAccounts',
      'root',
    ];


    await queryInterface.createTable('OAuthAuthorizationCodes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      redirectUri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ApplicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Applications',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      scope: {
        type: Sequelize.ARRAY(Sequelize.ENUM(...oAuthScopesValues)),
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OAuthAuthorizationCodes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_OAuthAuthorizationCodes_scope";');
  },
};

