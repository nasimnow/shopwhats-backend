const express = require("express");
const router = express.Router();

const moment = require("moment-timezone");
const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const lit = Sequilize.literal;

//get all details about loginned user
router.get("/", async (req, res) => {
  await models.account.update(
    {
      account_last_login: moment().tz("Asia/Kolkata"),
    },
    {
      where: { id: req.user.user.id },
    }
  );
  const results = await models.account.findByPk(req.user.user.id, {
    include: [
      {
        model: models.settings,
        as: "settings",
        attributes: { exclude: ["user_id"] },
      },
    ],
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

//add user notification token to database
router.post("/addnotiftoken", async (req, res) => {
  const response = await models.account.update(
    { account_notif_token: req.body.account_notif_token },
    { where: { id: req.user.user.id } }
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
