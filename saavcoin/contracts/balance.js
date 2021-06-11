//name:balance
//use:get balance of a user
//input:userAddress

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const hash = require("./hash");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const fn = Sequilize.fn;
const lit = Sequilize.literal;
const col = Sequilize.col;
const Op = Sequilize.Op;

module.exports = async (userAddress) => {
  const sended = await models.coin_ledger.findAll({
    where: { sender: userAddress },
    attributes: {
      include: [[fn("SUM", col("coin_ledger.amount")), "total_send"]],
    },
    raw: true,
  });

  const recieved = await models.coin_ledger.findAll({
    where: { reciever: userAddress },
    attributes: {
      include: [[fn("SUM", col("coin_ledger.amount")), "total_recieved"]],
    },
    raw: true,
  });
  console.log(recieved);
  console.log(userAddress);
  return {
    balance:
      parseFloat(recieved[0].total_recieved) - parseFloat(sended[0].total_send),
  };
};
