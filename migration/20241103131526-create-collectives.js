'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Collectives', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'COLLECTIVE',
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      legalName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company: {
        type: Sequelize.STRING,
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
        onUpdate: 'CASCADE', */
      },
      LastEditedByUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /*references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',*/
      },
      ParentCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',*/
      },
      HostCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /*references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      hostFeePercent: {
        type: Sequelize.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
      platformFeePercent: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 100,
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      longDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      expensePolicy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contributionPolicy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [3, 3],
        },
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      backgroundImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      countryISO: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [2, 2],
        },
      },
      settings: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      startsAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endsAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      timezone: {
        type: Sequelize.STRING,
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
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isIncognito: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      approvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      twitterHandle: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          is: /^[A-Za-z0-9_]{1,15}$/,
        },
      },
      githubHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      repositoryUrl: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      monthlySpending: {
        type: Sequelize.VIRTUAL,
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deactivatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isHostAccount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    // Indexes
    await queryInterface.addIndex('Collectives', ['slug'], { unique: true });
    await queryInterface.addIndex('Collectives', ['type']);
    await queryInterface.addIndex('Collectives', ['currency']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Collectives');
  },
};

