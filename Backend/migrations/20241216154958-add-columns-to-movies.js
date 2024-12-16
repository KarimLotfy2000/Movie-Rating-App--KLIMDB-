"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("movies", "director", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("movies", "release_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("movies", "runtime", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("movies", "box_office", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("movies", "director");
    await queryInterface.removeColumn("movies", "release_date");
    await queryInterface.removeColumn("movies", "runtime");
    await queryInterface.removeColumn("movies", "box_office");
  },
};
