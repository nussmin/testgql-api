'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequiredLegalDocuments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      documentType: {
        type: Sequelize.ENUM('US_TAX_FORM'),
        allowNull: false,
        defaultValue: 'US_TAX_FORM',
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
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

  async down(queryInterface, Sequelize) {
    // Drop the ENUM type for `documentType` in PostgreSQL
    await queryInterface.dropTable('RequiredLegalDocuments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_RequiredLegalDocuments_documentType";');
  },
};
