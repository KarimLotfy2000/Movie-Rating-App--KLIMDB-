module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "movies",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      trailer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      runtime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      box_office: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "movies",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
