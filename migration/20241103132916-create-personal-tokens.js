'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define the OAuthScopes values based on the provided enum
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

    // Create the 'PersonalTokens' table
    await queryInterface.createTable('PersonalTokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',*/
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
      scope: {
        type: Sequelize.ARRAY(Sequelize.ENUM(...oAuthScopesValues)),
        allowNull: true,
      },
      preAuthorize2FA: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      data: {
        type: Sequelize.JSONB,
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
      lastUsedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes if needed
    await queryInterface.addIndex('PersonalTokens', ['token'], { unique: true });
    await queryInterface.addIndex('PersonalTokens', ['UserId']);
    await queryInterface.addIndex('PersonalTokens', ['CollectiveId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the ENUM type first before dropping the table to avoid issues
    await queryInterface.dropTable('PersonalTokens');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_PersonalTokens_scope";');
  },
};
