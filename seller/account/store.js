const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

//get all details about loginned user
router.get("/", (req, res) => {
  let sql = `SELECT id,account_store,account_store_image,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address FROM account WHERE id=${req.user.user.id}`;
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
  let { account_password, ...userInfo } = req.user.user;
  return res.status(201).json({ status: true, data: userInfo });
});
//update store details
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

let profileStorage = multer.diskStorage({
  destination: function (req, res, callback) {
    let dir = "./profile-images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: profileStorage }).single("account_store_image");

//upload user store profile image to server
router.post("/profile-upload/", upload, async (req, res) => {
  let account_store_image = req.file.filename;

  let sql = `UPDATE account SET ? WHERE id=${req.user.user.id}`;
  let query = mysqlConnection.query(
    sql,
    { account_store_image },
    (err, result) => {
      if (err)
        return res.json({
          status_code: 500,
          status: false,
          error: { message: err },
        });
    }
  );
  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: { profile_image: account_store_image },
  });
});

module.exports = router;
