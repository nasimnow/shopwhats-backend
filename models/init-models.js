var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _analytics = require("./analytics");
var _categories = require("./categories");
var _categories_main = require("./categories_main");
var _links = require("./links");
var _products = require("./products");
var _products_images = require("./products_images");
var _products_variants = require("./products_variants");
var _settings = require("./settings");
var _store_analytics = require("./store_analytics");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var analytics = _analytics(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var categories_main = _categories_main(sequelize, DataTypes);
  var links = _links(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var products_images = _products_images(sequelize, DataTypes);
  var products_variants = _products_variants(sequelize, DataTypes);
  var settings = _settings(sequelize, DataTypes);
  var store_analytics = _store_analytics(sequelize, DataTypes);

  analytics.belongsTo(account, { as: "user", foreignKey: "user_id"});
  account.hasMany(analytics, { as: "analytics", foreignKey: "user_id"});
  categories.belongsTo(account, { as: "cat_user_account", foreignKey: "cat_user"});
  account.hasMany(categories, { as: "categories", foreignKey: "cat_user"});
  links.belongsTo(account, { as: "account", foreignKey: "account_id"});
  account.hasMany(links, { as: "links", foreignKey: "account_id"});
  products.belongsTo(account, { as: "product_user_account", foreignKey: "product_user"});
  account.hasMany(products, { as: "products", foreignKey: "product_user"});
  settings.belongsTo(account, { as: "user", foreignKey: "user_id"});
  account.hasMany(settings, { as: "settings", foreignKey: "user_id"});
  store_analytics.belongsTo(account, { as: "user", foreignKey: "user_id"});
  account.hasMany(store_analytics, { as: "store_analytics", foreignKey: "user_id"});
  products.belongsTo(categories, { as: "product_cat_category", foreignKey: "product_cat"});
  categories.hasMany(products, { as: "products", foreignKey: "product_cat"});
  categories.belongsTo(categories_main, { as: "cat_parent_categories_main", foreignKey: "cat_parent"});
  categories_main.hasMany(categories, { as: "categories", foreignKey: "cat_parent"});
  products_images.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(products_images, { as: "products_images", foreignKey: "product_id"});
  products_variants.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(products_variants, { as: "products_variants", foreignKey: "product_id"});

  return {
    account,
    analytics,
    categories,
    categories_main,
    links,
    products,
    products_images,
    products_variants,
    settings,
    store_analytics,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
