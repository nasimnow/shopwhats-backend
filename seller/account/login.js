const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysqlConnection = require("../../connection");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  let query = `SELECT * FROM account WHERE account_phone ='${req.body.phone}'`;
  mysqlConnection.query(query, async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ status_code: 500, status: false, error: { message: err } });
    }
    if (user != null) {
      user = user[0];
      console.log(user);
      if (user != "") {
        if (await bcrypt.compare(req.body.password, user.account_password)) {
          console.log("settt");

          jwt.sign(
            { user },
            "secretkey",
            { expiresIn: "25m" },
            (err, token) => {
              res.json({
                status: true,
                token,
              });
            }
          );
        } else {
          return res.json({
            status_code: 400,
            status: false,
            login: false,
            error: { message: "Check your credentials", code: 101 },
          });
        }
      } else {
        return res.json({
          status_code: 400,
          status: false,
          login: false,
          error: { message: "Check your credentials", code: 101 },
        });
      }
    }
  });
});
module.exports = router;
