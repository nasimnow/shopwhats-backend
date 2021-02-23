const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize.options.logging = false;
module.exports = sequelize;
