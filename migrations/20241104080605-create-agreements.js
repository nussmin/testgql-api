'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Agreements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [1, 60],
          notEmpty: true,
        },
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
          len: [0, 3000],
        },
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
        allowNull: true,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
        allowNull: true,
      },
      UploadedFileId: {
        type: Sequelize.INTEGER,
        /* references: { model: 'UploadedFiles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
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
    await queryInterface.dropTable('Agreements');
  },
};

