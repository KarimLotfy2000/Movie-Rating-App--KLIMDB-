module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "MovieGenre",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
      },
      genreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "genres",
          key: "id",
        },
      },
    },
    {
      tableName: "movie_genres",
      timestamps: false,
    }
  );
};
