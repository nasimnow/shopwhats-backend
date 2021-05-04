const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");

const fn = Sequilize.fn;
const lit = Sequilize.literal;

//get all details about loginned user
router.get("/", async (req, res) => {
  const results = await models.account.findByPk(req.user.user.id, {
    attributes: { exclude: ["account_password"] },
  });
  return res.status(201).json({ status: true, data: results });
});

//update store details
router.put("/", async (req, res) => {
  let store = {
    ...req.body,
  };
  const response = await models.account.update(store, {
    where: { id: req.user.user.id },
  });
  return res.status(201).json({
    message: {
      messageBody: `Succesfully Updated ${req.body.account_store}`,
      status: true,
      login: true,
    },
  });
});

//flip store status
router.put("/status/:id", async (req, res) => {
  const response = await models.account.update(
    { account_store_status: lit("NOT account_store_status") },
    { where: { id: req.params.id } }
  );
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

// add profile image to database
router.post("/addprofile", async (req, res) => {
  const response = await models.account.update(
    { account_store_image: req.body.profile_image },
    { where: { id: req.user.user.id } }
  );
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

// let profileStorage = multer.diskStorage({
//   destination: function (req, res, callback) {
//     let dir = "./profile-images";
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     callback(null, dir);
//   },
//   filename: function (req, file, callback) {
//     callback(
//       null,
//       file.fieldname + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// let upload = multer({ storage: profileStorage }).single("account_store_image");

// //upload user store profile image to server
// router.post("/profile-upload", upload, async (req, res) => {
//   const response = await models.account.update(
//     { account_store_image: req.file.filename },
//     { where: { id: req.user.user.id } }
//   );
//   return res.json({
//     status_code: 200,
//     status: true,
//     login: true,
//   });
// });

module.exports = router;
