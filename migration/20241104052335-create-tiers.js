'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tiers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CollectiveId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Collectives',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [1, 255],
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('TIER', 'MEMBERSHIP', 'DONATION', 'TICKET', 'PRODUCT', 'SERVICE'),
        allowNull: false,
        defaultValue: 'TIER',
      },
      description: {
        type: Sequelize.STRING(510),
        allowNull: true,
      },
      longDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      useStandalonePage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      videoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      button: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      presets: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      amountType: {
        type: Sequelize.ENUM('FIXED', 'FLEXIBLE'),
        allowNull: false,
        defaultValue: 'FIXED',
      },
      minimumAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      interval: {
        type: Sequelize.STRING(8),
        allowNull: true,
        validate: {
          isIn: [['month', 'year', 'flexible']],
        },
      },
      maxQuantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      goal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      customFields: {
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
    // Drop the Tiers table and ENUM types
    await queryInterface.dropTable('Tiers');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tiers_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tiers_amountType";');
  },
};
