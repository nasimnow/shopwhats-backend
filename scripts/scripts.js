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
  let variants = await models.products_variants.findAll();
  variants.forEach(async (vari) => {
    const product = await models.products.findOne({
      where: { id: vari.product_id },
    });
    try {
      const responseup = await models.products_variants.update(
        {
          variant_price: product.product_price,
          variant_sale_price: product.product_is_sale
            ? product.product_sale_price
            : product.product_price,
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
