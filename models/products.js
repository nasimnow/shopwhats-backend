const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    product_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    product_stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    product_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    product_is_sale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    product_sale_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    product_desc: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    product_cat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    product_clicks: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "product_user",
        using: "BTREE",
        fields: [
          { name: "product_user" },
        ]
      },
      {
        name: "product_cat",
        using: "BTREE",
        fields: [
          { name: "product_cat" },
        ]
      },
    ]
  });
};
