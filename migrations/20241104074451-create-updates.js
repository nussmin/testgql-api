'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Updates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      TierId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Tiers', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
      },
      FromCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */ 
      },
      LastEditedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      html: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.STRING,
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isChangelog: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      notificationAudience: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      publishedAt: {
        type: Sequelize.DATE,
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
      makePublicOn: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      summary: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Updates');
  },
};
