const express = require("express");
const router = express.Router();

const sequelize = require("../dbconnection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const fn = Sequilize.fn;
const lit = Sequilize.literal;
const col = Sequilize.col;
const Op = Sequilize.Op;

router.get("/array", (req, res) => {
  const responseProducts = models.products.findAll({
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
});

module.exports = router;
