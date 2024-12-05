"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change 'rating' column to INTEGER
    await queryInterface.changeColumn("ratings", "rating", {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert 'rating' column to DECIMAL(5,2)
    await queryInterface.changeColumn("ratings", "rating", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    });
  },
};
