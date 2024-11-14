'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
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

    await queryInterface.createTable('UserTokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('OAUTH'),
        allowNull: false,
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      accessTokenExpiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      refreshTokenExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ApplicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /*references: {
          model: 'Applications',
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
        onUpdate: 'CASCADE',*/
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      scope: {
        type: Sequelize.ARRAY(Sequelize.ENUM(...oAuthScopesValues)),
        allowNull: true,
      },
      preAuthorize2FA: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
      lastUsedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserTokens');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_UserTokens_type";'
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_UserTokens_scope";`
    );
  },
};
