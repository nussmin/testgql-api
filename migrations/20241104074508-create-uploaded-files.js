'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UploadedFiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      kind: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [1, 1024], // Ensures file name length doesn't exceed the maximum
        },
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [0, 1200], // Ensures URL length doesn't exceed maximum
        },
      },
      data: {
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
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      CreatedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Users',
          key: 'id',
        },
        
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL', */
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UploadedFiles');
  },
};
