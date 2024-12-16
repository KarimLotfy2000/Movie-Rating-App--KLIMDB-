"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movie_genres", {
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
      genre_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "genres",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movie_genres");
  },
};
