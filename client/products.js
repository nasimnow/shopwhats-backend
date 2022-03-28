const express = require("express");
const router = express.Router();
const sequelize = require("../dbconnection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");

router.post("/array", async (req, res) => {
  const responseProducts = await models.products.findAll({
    where: { id: req.body.products_id },
    include: [
      {
        model: models.products_images,
        as: "products_images",
      },
      {
        model: models.products_variants,
        as: "products_variants",
      },
    ],
  });

  return res.json({
    status: true,
    data: responseProducts,
  });
});

module.exports = router;
