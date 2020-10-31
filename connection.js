const mysql = require("mysql");

const mysqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "shopwhats",
  multipleStatements: true,
});

module.exports = mysqlConnection;
