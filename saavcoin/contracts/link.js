//name:link
//use:add ledger entry
//input:amount,sender,reciever

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const moment = require("moment-timezone");
const hash = require("./hash");

module.exports = async (amount, sender, reciever, referrer) => {
  await models.coin_ledger.create({
    date: moment().tz("Asia/Kolkata"),
    amount,
    sender,
    reciever,
    referrer,
    phash: hash({
      sender,
      reciever,
      referrer,
    }),
  });
};
