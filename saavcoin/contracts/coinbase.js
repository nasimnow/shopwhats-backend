//name:coinbase
//use:minting new saavcoin
//input:amount,reciever

const link = require("./link");

module.exports = (amount, reciever, referrer) => {
  link(amount, 108, reciever, referrer);
};
