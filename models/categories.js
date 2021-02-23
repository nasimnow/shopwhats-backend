const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cat_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cat_parent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories_main',
        key: 'id'
      }
    },
    cat_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'categories',
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
        name: "cat_parent",
        using: "BTREE",
        fields: [
          { name: "cat_parent" },
        ]
      },
      {
        name: "cat_user",
        using: "BTREE",
        fields: [
          { name: "cat_user" },
        ]
      },
    ]
  });
};
