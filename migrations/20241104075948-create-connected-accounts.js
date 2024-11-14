'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConnectedAccounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['paypal', 'stripe', 'stripe_customer', 'github', 'twitter', 'transferwise', 'plaid', 'privacy', 'thegivingblock', 'meetup']],
            msg: 'Must be one of the supported services: paypal, stripe, stripe_customer, github, twitter, transferwise, plaid, privacy, thegivingblock, meetup',
          },
        },
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      clientId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      settings: {
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
      hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ConnectedAccounts');
  },
};
