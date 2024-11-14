'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SocialLinks', {
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: { model: 'Collectives', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',*/
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: 'WEBSITE',
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          isUrl: {
            msg: 'Social link URL must be a valid URL',
          },
        },
      },
      order: {
        type: Sequelize.INTEGER,
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SocialLinks');
  },
};
