const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

//add or edit links
router.post("/", async (req, res) => {
  const { links } = req.body;
  try {
    links.forEach(async (link) => {
      link = { ...link, account_id: req.user.user.id };
      if (link.id) {
        await models.links.update(link, { where: { id: link.id } });
      } else {
        await models.links.create(link);
      }
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

//get links of a user
router.get("/", async (req, res) => {
  try {
    const links = await models.links.findOne({
      where: {
        account_id: req.user.user.id,
      },
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

module.exports = router;
