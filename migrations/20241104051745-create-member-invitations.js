'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const memberRolesValues = [
      'HOST',
      'ADMIN',
      'MEMBER',
      'CONTRIBUTOR',
      'BACKER',
      'ATTENDEE',
      'FOLLOWER',
      'CONNECTED_COLLECTIVE',
      'ACCOUNTANT',
    ];

    await queryInterface.createTable('MemberInvitations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      MemberCollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        /* references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */
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
      },
      TierId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        /* references: {
          model: 'Tiers',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE', */
      },
      role: {
        type: Sequelize.ENUM(...memberRolesValues), // Reuse the ENUM values in `Member` table
        allowNull: false,
        defaultValue: 'MEMBER',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      since: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
    // Drop the MemberInvitations table without removing the ENUM type, as it's shared
    await queryInterface.dropTable('MemberInvitations');
  },
};

