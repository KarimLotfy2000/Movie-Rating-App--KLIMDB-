"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movie_actors", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "movies",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      actor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "actors",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movie_actors");
  },
};
