module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Actor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "actors",
      timestamps: false,
    }
  );
};
