require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "karim",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
};
