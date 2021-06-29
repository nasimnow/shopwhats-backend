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
  console.log(recieved, sended);
  console.log(parseFloat(recieved[0].total_recieved));

  return {
    balance:
      parseFloat(
        recieved[0].total_recieved !== null ? recieved[0].total_recieved : 0
      ) - parseFloat(sended[0].total_send !== null ? sended[0].total_send : 0),
  };
};