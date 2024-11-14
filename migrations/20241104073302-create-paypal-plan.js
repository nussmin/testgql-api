'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaypalPlans', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      interval: {
        type: Sequelize.ENUM('month', 'year'),
        allowNull: false,
      },
      ProductId: {
        type: Sequelize.STRING,
        allowNull: false,
        /* references: { model: 'PaypalProducts', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', */ 
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaypalPlans');
    // Drop ENUM type if needed
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_PaypalPlans_interval";');
  },
};
