'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      channel: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'email',
        validate: {
          isIn: {
            args: [['email', 'slack', 'twitter', 'webhook']],
            msg: `Must be one of email, slack, twitter, webhook`,
          },
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      lastSuccessAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      webhookUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: {
            msg: 'Webhook URL must be a valid URL',
          },
        },
      },
    });

    // Non-unique index on CollectiveId, type, and channel
    await queryInterface.addIndex('Notifications', ['CollectiveId', 'type', 'channel'], {
      unique: false,
    });

    // Unique index on channel, type, webhookUrl, and CollectiveId
    await queryInterface.addIndex('Notifications', ['channel', 'type', 'webhookUrl', 'CollectiveId'], {
      unique: true,
      name: 'notifications_channel_type_webhookUrl_collectiveId_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('Notifications', 'notifications_channel_type_webhookUrl_collectiveId_unique');
    await queryInterface.removeIndex('Notifications', ['CollectiveId', 'type', 'channel']);

    // Drop the table
    await queryInterface.dropTable('Notifications');
  },
};
