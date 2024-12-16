module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "ratings",
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
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      review: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "ratings",
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
          name: "movie_id",
          using: "BTREE",
          fields: [{ name: "movie_id" }],
        },
      ],
    }
  );
};
