const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mysql://root:silverstar@localhost:3306/shopwhats");
sequelize.options.logging = false;
module.exports = sequelize;
