module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Genre",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "genres",
      timestamps: false,
    }
  );
};
