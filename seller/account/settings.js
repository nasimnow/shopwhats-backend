const express = require("express");
const router = express.Router();

const moment = require("moment-timezone");
const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const lit = Sequilize.literal;
const updateOrCreate = require("../utils/sequelizeFunctions");

router.get("/", async (req, res) => {
  const user_settings = await models.settings.findOne({
    where: {
      user_id: req.user.user.id,
    },
  });
  console.log(user_settings);
  if (user_settings) {
    return res.json({ user_settings, status: true });
  }
  return res.json({ status: false });
});

router.post("/", async (req, res) => {
  const newItem = req.body;
  const foundItem = await models.settings.findOne({
    where: { user_id: req.user.user.id },
  });
  if (!foundItem) {
    // Item not found, create a new one
    const item = await models.settings.create({
      ...newItem,
      user_id: req.user.user.id,
    });
    return res.json({ item, created: true });
  }
  // Found an item, update it
  const item = await models.settings.update(newItem, {
    where: { user_id: req.user.user.id },
  });
  return res.json({ item, updated: true });
});

module.exports = router;
