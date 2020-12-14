const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();

//get all catogories of current user
router.get("/", (req, res) => {
  let sql = `SELECT id,account_store,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address	 FROM account WHERE id=${req.user.user.id}`;
  let query = mysqlConnection.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: { messageBody: err, status: false } });

    return res.status(201).json({ status: true, data: results });
  });
});

//return the details of current loginned user
router.get("/user", (req, res) => {
  let userInfo = req.user;
  delete userInfo.account_password;
  return res.status(201).json({ status: true, data: userInfo });
});
//update store detaisl
router.put("/", (req, res) => {
  let store = {
    account_store: req.body.account_store,
    account_whatsapp: req.body.account_whatsapp,
    account_store_address: req.body.account_store_address,
    account_store_desc: req.body.account_store_desc,
  };
  let sql = `UPDATE account SET ? WHERE id=${req.user.user.id}`;
  let query = mysqlConnection.query(sql, store, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: { messageBody: err, status: false } });
    res.status(201).json({
      message: {
        messageBody: `Succesfully Updated ${req.body.account_store}`,
        status: true,
        login: true,
      },
    });
  });
});

module.exports = router;
