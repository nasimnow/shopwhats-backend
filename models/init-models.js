var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _categories = require("./categories");
var _categories_main = require("./categories_main");
var _products = require("./products");
var _products_images = require("./products_images");
var _store_analytics = require("./store_analytics");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var categories_main = _categories_main(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var products_images = _products_images(sequelize, DataTypes);
  var store_analytics = _store_analytics(sequelize, DataTypes);

  categories.belongsTo(categories_main, { as: "cat_parent_categories_main", foreignKey: "cat_parent"});
  categories_main.hasMany(categories, { as: "categories", foreignKey: "cat_parent"});
  categories.belongsTo(account, { as: "cat_user_account", foreignKey: "cat_user"});
  account.hasMany(categories, { as: "categories", foreignKey: "cat_user"});
  products.belongsTo(account, { as: "product_user_account", foreignKey: "product_user"});
  account.hasMany(products, { as: "products", foreignKey: "product_user"});
  products.belongsTo(categories, { as: "product_cat_category", foreignKey: "product_cat"});
  categories.hasMany(products, { as: "products", foreignKey: "product_cat"});
  products_images.belongsTo(products, { as: "product_", foreignKey: "product_id"});
  products.hasMany(products_images, { as: "products_images", foreignKey: "product_id"});

  return {
    account,
    categories,
    categories_main,
    products,
    products_images,
    store_analytics,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
