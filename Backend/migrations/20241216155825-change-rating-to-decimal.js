"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ratings", "rating", {
      type: Sequelize.DECIMAL(3, 1), // Allows values like 8.5, 9.0, etc.
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ratings", "rating", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
