const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

//add or edit links
router.post("/", async (req, res) => {
  const { id, links } = req.body;
  if (id) {
    try {
      await models.links.update(
        {
          links,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Update success",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Update failed",
      });
    }
  } else {
    try {
      await models.links.create({
        account_id: req.user.user.id,
        links,
      });
      res.json({
        success: true,
        message: "Create success",
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Create failed",
      });
    }
  }
});

module.exports = router;
