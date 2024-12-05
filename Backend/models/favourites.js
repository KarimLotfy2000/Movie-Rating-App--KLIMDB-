module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "favourites",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "favourites",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "user_id",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }, { name: "movie_id" }],
        },
        {
          name: "user_id_2",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }, { name: "movie_id" }],
        },
        {
          name: "movie_id",
          using: "BTREE",
          fields: [{ name: "movie_id" }],
        },
      ],
    }
  );
};
