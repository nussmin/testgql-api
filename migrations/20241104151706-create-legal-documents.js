'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LegalDocuments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 2015,
        },
        unique: 'yearTypeCollective',
      },
      documentType: {
        type: Sequelize.ENUM('US_TAX_FORM'),
        allowNull: false,
        defaultValue: 'US_TAX_FORM',
        unique: 'yearTypeCollective',
      },
      documentLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requestStatus: {
        type: Sequelize.ENUM('NOT_REQUESTED', 'REQUESTED', 'RECEIVED', 'ERROR', 'INVALID'),
        allowNull: false,
        defaultValue: 'NOT_REQUESTED',
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
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
        unique: 'yearTypeCollective',
      },
      service: {
        type: Sequelize.ENUM('DROPBOX_FORMS', 'OPENCOLLECTIVE'),
        allowNull: false,
        defaultValue: 'DROPBOX_FORMS',
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    });

    // Composite unique index on year, documentType, and CollectiveId
    await queryInterface.addIndex('LegalDocuments', ['year', 'documentType', 'CollectiveId'], {
      unique: true,
      name: 'yearTypeCollective_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the composite unique index
    await queryInterface.removeIndex('LegalDocuments', 'yearTypeCollective_unique');

    // Drop the table
    await queryInterface.dropTable('LegalDocuments');
  },
};

