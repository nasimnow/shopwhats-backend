const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");

router.post("/", async (req, res) => {
  try {
    hashedPassword = await bcrypt.hash(req.body.account_password, 10);
    //check if mobile no is registered
    const mobileCheck = await models.account.count({
      where: { account_phone: req.body.account_phone },
    });
    if (mobileCheck > 0)
      return res.json({
        status: false,
        message: "Already Registered",
      });
    let storeLinkGen = await checkStoreUsername(req.body.account_store);
    console.log(storeLinkGen);
    const addUser = await models.account.create({
      account_phone: req.body.account_phone,
      account_store: req.body.account_store,
      account_store_link: storeLinkGen,
      account_password: hashedPassword,
      account_whatsapp: req.body.account_phone,
    });
    return res.json({
      status: true,
      message: "Succesfully Registered",
    });
  } catch (error) {
    console.log(error);
  }
});

//register without password
router.post("/new", async (req, res) => {
  //check if mobile no is registered
  const mobileCheck = await models.account.count({
    where: { account_phone: req.body.account_phone },
  });
  if (mobileCheck > 0)
    return res.json({
      status: false,
      message: "Already Registered",
    });
  let storeLinkGen = await checkStoreUsername(req.body.account_store);
  console.log(storeLinkGen);
  const addUser = await models.account.create({
    account_phone: req.body.account_phone,
    account_store: req.body.account_store,
    account_store_link: storeLinkGen,
    account_whatsapp: req.body.account_phone,
  });
  return res.json({
    status: true,
    message: "Succesfully Registered",
  });
});

//check store link (new)
const checkStoreUsername = async (storeName) => {
  //replace space with underscore
  storeName = storeName.replace(/ /g, "_");
  const userNameCount = await models.account.count({
    where: { account_store_link: storeName },
  });

  if (userNameCount < 1) return storeName;
  else
    return checkStoreUsername(
      storeName + Math.floor(Math.random() * (999 - 100 + 1) + 100)
    );
};

router.post("/checkphone/:phone", async (req, res) => {
  let userData = await models.account.count({
    where: { account_phone: req.params.phone },
  });
  return res.json({ status: userData < 1 });
});

function checkUser(phone, store, addUser, registerd) {
  let sql = `SELECT COUNT(*) AS count  FROM account WHERE account_phone=${phone}`;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (result[0].count == 0) {
      checkLink(store, addUser);
    } else registerd();
  });
}

function checkLink(store, addUser) {
  let sql = `SELECT COUNT(*) AS count  FROM account WHERE account_store_link='${store}'`;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (result[0].count == 0) {
      console.log(store);
      addUser(store);
    } else {
      let newStore = store + Math.floor(Math.random() * (999 - 100 + 1) + 100);
      checkLink(newStore, addUser);
    }
  });
}

module.exports = router;
