'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmojiReactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE', */
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
      },
      CommentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Comments',
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE', */ 
      },
      UpdateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Updates',
          key: 'id',
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',*/
      },
      emoji: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['👍️', '👎', '😀', '🎉', '😕', '❤️', '🚀', '👀']],
            msg: `Must be a valid emoji`,
          },
        },
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
    });

    // Add a unique index on UserId, CommentId, and emoji to prevent duplicate reactions
    await queryInterface.addIndex('EmojiReactions', ['UserId', 'CommentId', 'emoji'], {
      unique: true,
      name: 'EmojiReactions_UserId_CommentId_emoji_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique index first
    await queryInterface.removeIndex('EmojiReactions', 'EmojiReactions_UserId_CommentId_emoji_unique');

    // Drop the table
    await queryInterface.dropTable('EmojiReactions');
  },
};

