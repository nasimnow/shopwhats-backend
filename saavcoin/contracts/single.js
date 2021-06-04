//name:single
//use:check if reward already given for one time rewards
//input:sender,reciever,referrer

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const hash = require("./hash");
const models = initModels(sequelize);

module.exports = async (sender, reciever, referrer) => {
  const data = await models.coin_ledger.findAll({
    where: { phash: hash({ sender, reciever, referrer }) },
  });
  return data.length < 1;
};
