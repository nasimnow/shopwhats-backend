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
    checkUser(
      req.body.account_phone,
      req.body.account_store,
      //callback for registering user if all requirments met
      (store_new) => {
        let account = {
          account_phone: req.body.account_phone,
          account_password: hashedPassword,
          account_store: req.body.account_store,
          account_store_link: store_new,
          account_whatsapp: req.body.account_phone,
        };
        let sql = "INSERT INTO account SET ?";
        let query = mysqlConnection.query(sql, account, (err, result) => {
          if (err)
            return res.json({
              status_code: 500,
              status: false,
              error: { message: err },
            });
          return res.json({
            status_code: 201,
            status: true,
            login: false,
            data: account,
          });
        });
      },
      () => {
        return res.json({
          status_code: 400,
          status: false,
          login: false,
          error: { message: "Already Registered", code: 100 },
        });
      }
    );
  } catch (error) {}
});

router.post("/checkphone/:phone", async (req, res) => {
  let userData = await models.account.findOne({
    where: { account_phone: req.params.phone },
  });
  console.log(userData);
  return res.json({ status: userData === null });
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
