const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account_store: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    account_store_image: {
      type: DataTypes.STRING(3000),
      allowNull: true
    },
    account_phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    account_password: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    account_whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    account_store_link: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    account_store_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    account_store_desc: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    account_store_address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    account_notif_token: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    account_last_login: {
      type: DataTypes.DATE,
      allowNull: false
    },
    account_register_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'account',
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
    ]
  });
};
