const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("mysql://admin:silverstar@localhost:3306/fliqcwco_shopwhats");
const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize.options.logging = false;
module.exports = sequelize;
//make server https
