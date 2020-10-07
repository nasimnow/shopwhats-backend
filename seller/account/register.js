const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("register.ejs");
});

router.post("/", async (req, res) => {
  try {
    hashedPassword = await bcrypt.hash(req.body.account_password, 10);

    checkUser(
      req.body.account_phone,
      req.body.account_store,
      (store_new) => {
        let account = {
          account_phone: req.body.account_phone,
          account_password: hashedPassword,
          account_store: store_new,
          account_whatsapp: req.body.account_phone,
        };
        let sql = "INSERT INTO account SET ?";
        let query = mysqlConnection.query(sql, account, (err, result) => {
          if (err)
            res.json({
              status_code: 500,
              status: false,
              error: { message: err },
            });
          res.json({
            status_code: 201,
            status: true,
            login: false,
            data: account,
          });
        });
      },
      () => {
        res.json({
          status_code: 400,
          status: false,
          login: false,
          error: { message: "Already Registered", code: 100 },
        });
      }
    );
  } catch (error) {}
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
  let sql = `SELECT COUNT(*) AS count  FROM account WHERE account_store='${store}'`;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (result[0].count == 0) {
      addUser(store);
    } else {
      let newStore = store + Math.floor(Math.random() * (999 - 100 + 1) + 100);
      checkLink(newStore, addUser);
    }
  });
}

module.exports = router;
