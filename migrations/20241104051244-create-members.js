'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define ENUM values for the role
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

    // Create the ENUM type for roles
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_Members_role" AS ENUM(${memberRolesValues
        .map((role) => `'${role}'`)
        .join(', ')});`
    );

    await queryInterface.createTable('Members', {
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
        onDelete: 'SET NULL',
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
        type: Sequelize.ENUM(...memberRolesValues),
        allowNull: false,
        defaultValue: 'MEMBER',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      publicMessage: {
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

    // Add indexes
    await queryInterface.addIndex('Members', ['MemberCollectiveId', 'CollectiveId', 'role'], {
      name: 'MemberCollectiveId-CollectiveId-role',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the Members table and the ENUM type for role
    await queryInterface.dropTable('Members');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Members_role";');
  },
};
