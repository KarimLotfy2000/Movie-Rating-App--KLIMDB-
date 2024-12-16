module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "MovieActor",
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
      actorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "actors",
          key: "id",
        },
      },
    },
    {
      tableName: "movie_actors",
      timestamps: false,
    }
  );
};
