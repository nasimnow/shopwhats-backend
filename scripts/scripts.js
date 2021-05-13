const mysqlConnection = require("../connection");
const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");

const sequelize = require("../dbconnection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const fn = Sequilize.fn;
const lit = Sequilize.literal;
const Op = Sequilize.Op;

router.get("/migrate_variant_price", async (req, res) => {
  let variants = await models.products.findAll();
  variants.forEach(async (vari) => {
    try {
      const responseup = await models.products.update(
        {
          product_sale_price: vari.product_is_sale
            ? vari.product_sale_price
            : vari.product_price,
        },
        { where: { id: parseInt(vari.id) } }
      );
    } catch (error) {
      console.log(error);
    }
  });
  res.send("runn scrtip");
});

module.exports = router;
