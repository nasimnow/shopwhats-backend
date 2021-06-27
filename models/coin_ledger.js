const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coin_ledger', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    reciever: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    referrer: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phash: {
      type: DataTypes.STRING(2000),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'coin_ledger',
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
        name: "reciever",
        using: "BTREE",
        fields: [
          { name: "reciever" },
        ]
      },
      {
        name: "sender",
        using: "BTREE",
        fields: [
          { name: "sender" },
        ]
      },
    ]
  });
};
