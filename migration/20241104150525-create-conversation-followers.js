'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConversationFollowers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
        allowNull: false,
      },
      ConversationId: {
        type: Sequelize.INTEGER,
        /* references: {
          model: 'Conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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

    // Add a unique constraint on UserId and ConversationId to ensure unique followers per conversation
    await queryInterface.addIndex('ConversationFollowers', ['UserId', 'ConversationId'], {
      unique: true,
      name: 'ConversationFollowers_UserId_ConversationId_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique index first
    await queryInterface.removeIndex('ConversationFollowers', 'ConversationFollowers_UserId_ConversationId_unique');

    // Then drop the table
    await queryInterface.dropTable('ConversationFollowers');
  },
};
