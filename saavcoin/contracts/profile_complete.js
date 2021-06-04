//name:profile_complete
//use:reward user for completing info
//input:reciever

const single = require("./single");
const coinbase = require("./coinbase");

module.exports = async (reciever) => {
  if (await single(108, reciever, "profile_complete")) {
    coinbase(5, reciever, "profile_complete");
    return true;
  }
  return false;
};
