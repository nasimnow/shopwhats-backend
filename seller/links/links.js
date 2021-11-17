const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

//add or edit links
router.post("/reorder", async (req, res) => {
  const { links } = req.body;
  try {
    links.forEach(async (link) => {
      link = { ...link, account_id: req.user.user.id };
      if (link.id) await models.links.update(link, { where: { id: link.id } });
    });

    res.status(200).send({
      success: true,
      message: "Links updated successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/add", async (req, res) => {
  const { link } = req.body;
  try {
    link.account_id = req.user.user.id;
    let resp = await models.links.create(link);
    res.status(200).send({
      success: true,
      message: "Link added successfully",
      data: resp,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/edit", async (req, res) => {
  const { link } = req.body;
  try {
    let resp = await models.links.update(link, { where: { id: link.id } });
    res.status(200).send({
      success: true,
      message: "Link updated successfully",
      data: resp,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await models.links.destroy({ where: { id } });
    res.status(200).send({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

//get links of a user
router.get("/", async (req, res) => {
  try {
    const account_info_raw = await models.account.findOne({
      where: { id: req.user.user.id },
    });
    const {
      account_password,
      account_last_login,
      account_register_date,
      account_notif_token,
      ...account_info
    } = account_info_raw.dataValues;
    const user_settings = await models.settings.findOne({
      where: {
        user_id: req.user.user.id,
      },
    });
    const links = await models.links.findAll({
      where: {
        account_id: req.user.user.id,
      },
      order: [["position", "asc"]],
    });
    res.json({
      success: true,
      data: { links, user_settings, account_info },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Get failed",
    });
  }
});

module.exports = router;
