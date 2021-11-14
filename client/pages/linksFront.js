const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const Op = Sequilize.Op;

router.get("/:account_username", async (req, res) => {
  try {
    const account_info = await models.account.findOne({
      where: { account_store_link: req.params.account_username },
    });
    if (!storeinfo)
      return res
        .status(404)
        .json({ status: false, error: "User Doesnt Exist" });

    const links = await models.links.findAll({
      where: {
        account_id: account_info.id,
      },
      order: [["position", "asc"]],
    });
    res.json({
      success: true,
      data: links,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Get failed",
    });
  }
});
