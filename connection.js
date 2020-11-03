const mysql = require("mysql");

const mysqlConnection = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
  multipleStatements: true,
});

module.exports = mysqlConnection;
