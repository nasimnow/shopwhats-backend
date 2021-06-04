//name:hash
//use:hashes data
//input:data to hash

const crypto = require("crypto");

module.exports = (data) => {
  return crypto
    .createHash("sha256")
    .update(Buffer.from(JSON.stringify({ ...data })))
    .digest("hex");
};
