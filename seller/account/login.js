const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");

router.post("/", async (req, res) => {
  const user = await models.account.findOne({
    where: { account_phone: req.body.phone },
  });
  //check if mysql has return null or empty
  if (!user) {
    return res.json({
      status_code: 400,
      status: false,
      login: false,
      error: { message: "Check your credentials", code: 101 },
    });
  }

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
  jwt.sign({ user }, "secretkey", { expiresIn: "14d" }, (err, token) => {
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

router.post("/password-reset", async (req, res) => {
  const phoneNumber = req.body.phone;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    await models.account.update(
      { account_password: hashedPassword },
      {
        where: { account_phone: phoneNumber },
      }
    );
    return res.json({
      status: true,
    });
  } catch (error) {
    return res.json({
      status: false,
    });
  }
});

module.exports = router;
