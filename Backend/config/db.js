const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createdb({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
db.connect((error) => {
  if (error) throw error;
  console.log("Connected to MySQL database!");
});

module.exports = db;
