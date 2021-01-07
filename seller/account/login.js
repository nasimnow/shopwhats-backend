const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysqlConnection = require("../../connection");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  let query = `SELECT * FROM account WHERE account_phone ='${req.body.phone}'`;
  mysqlConnection.query(query, async (err, user) => {
    //checks for any mysql error if return error
    if (err) {
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    }
    //check if mysql has return null or empty
    console.log(user.length);
    if (user.length < 1) {
      console.log("entered");
      return res.json({
        status_code: 400,
        status: false,
        login: false,
        error: { message: "Check your credentials", code: 101 },
      });
    }
    console.log(JSON.stringify(user));
    user = user[0];

    //compare user typed password and password in db
    if (!(await bcrypt.compare(req.body.password, user.account_password))) {
      return res.json({
        status_code: 400,
        status: false,
        login: false,
        error: { message: "Check your credentials", code: 102 },
      });
    }

    //credentials validated and generates jwt token
    jwt.sign({ user }, "secretkey", { expiresIn: "1m" }, (err, token) => {
      if (err) {
        return res.json({
          status_code: 500,
          status: false,
          login: false,
          error: { message: "Check your credentials", code: 109 },
        });
      }
      return res.json({
        status: true,
        token,
      });
    });
  });
});
module.exports = router;
