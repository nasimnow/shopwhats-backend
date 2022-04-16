const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const Op = Sequilize.Op;

router.get("/:store", async (req, res) => {
  console.log(req);
  const storeinfo = await models.account.findOne({
    where: { account_store_link: req.params.store },
  });

  //no store by that url
  if (!storeinfo)
    return res.status(404).json({ status: false, error: "User Doesnt Exist" });

  const categories = await models.categories.findAll({
    where: { cat_user: storeinfo.id },
    order: [
      ["cat_clicks", "desc"],
      ["id", "desc"],
    ],
  });

  return res.status(200).json({
    status: true,
    data: {
      storeinfo,
      categories,
    },
  });
});

router.get("/products/:storeid/:pageno", async (req, res) => {
  const storeId = +req.params.storeid;
  const pageNo = +req.params.pageno;
  const limit = 10;
  const productCount = await models.products.count({
    where: { product_user: storeId, product_stock: { [Op.ne]: 0 } },
  });
  let offset = limit * pageNo - limit;
  const products = await models.products.findAll({
    where: { product_user: storeId, product_stock: { [Op.ne]: 0 } },
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
    limit: limit,
    offset: offset,
    order: [["id", "desc"]],
  });
  return res.status(200).json({
    status: true,
    isLastPage: limit * pageNo >= productCount,
    data: {
      products,
    },
  });
});

module.exports = router;
