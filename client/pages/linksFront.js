const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const Op = Sequilize.Op;

router.get("/link/:account_username", async (req, res) => {
  try {
    const account_info_raw = await models.account.findOne({
      where: { account_store_link: req.params.account_username },
    });
    if (!account_info_raw)
      return res
        .status(404)
        .json({ status: false, error: "User Doesnt Exist" });

    const {
      account_password,
      account_last_login,
      account_register_date,
      account_notif_token,
      ...account_info
    } = account_info_raw.dataValues;

    const user_settings = await models.settings.findOne({
      where: {
        user_id: account_info.id,
      },
    });

    const links = await models.links.findAll({
      where: {
        account_id: account_info.id,
      },
      order: [["position", "asc"]],
    });
    res.json({
      success: true,
      account_info,
      links,
      user_settings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Get failed",
    });
  }
});

router.get("/domain/:account_domain", async (req, res) => {
  try {
    const account_info_raw = await models.account.findOne({
      where: { account_domain: req.params.account_domain },
    });
    if (!account_info_raw)
      return res
        .status(404)
        .json({ status: false, error: "User Doesnt Exist" });

    const {
      account_password,
      account_last_login,
      account_register_date,
      account_notif_token,
      ...account_info
    } = account_info_raw.dataValues;

    const user_settings = await models.settings.findOne({
      where: {
        user_id: account_info.id,
      },
    });

    const links = await models.links.findAll({
      where: {
        account_id: account_info.id,
      },
      order: [["position", "asc"]],
    });
    res.json({
      success: true,
      account_info,
      links,
      user_settings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Get failed",
    });
  }
});

module.exports = router;
