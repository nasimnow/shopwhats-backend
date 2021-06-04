//name:refer
//use:reward user for referring friend
//input:reciever,referred

const single = require("./single");
const coinbase = require("./coinbase");

module.exports = async (reciever, referred) => {
  if (await single(108, reciever, `refer-${referred}`)) {
    coinbase(5, reciever, "refer");
    return true;
  }
  return false;
};
