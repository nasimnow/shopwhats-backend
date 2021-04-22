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

let todayDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
//get all details of current store user by link
router.get("/:store", (req, res) => {
  const results = models.account.findOne({
    where: { account_store_link: req.params.store },
  });
  if (results.length < 1)
    return res
      .status(500)
      .json({ message: { messageBody: err, status: false } });

  return res.status(201).json({ status: true, data: results });
});

//get all categories of current store user
router.get("/categories/all/:userId", async (req, res) => {
  const results = await models.categories.findAll({
    where: { cat_user: req.params.userId },
  });

  return res.status(201).json({ status: true, data: results });
});

//get all details of current store by id
router.get("/byid/:storeId", async (req, res) => {
  const results = await models.account.findByPk(req.params.storeId);
  if (results.length < 1)
    return res
      .status(500)
      .json({ message: { messageBody: err, status: false } });

  return res.status(201).json({ status: true, data: results });
});

router.get("/analytics/storeviewsnew/:shopId", async (req, res) => {
  const data = await models.store_analytics.findOne({
    where: { user_id: req.params.shopId, date: todayDate },
  });
  console.log(data);
  if (data) {
    await models.store_analytics.increment("store_views", {
      where: { id: data.id },
    });
  } else {
    await models.store_analytics.create({
      user_id: req.params.shopId,
      store_views: 1,
      message_clicks: 0,
    });
  }
  res.json({ status: true });
});

//update store whatsapp button clicks
router.get("/analytics/messagecount/:shopId", async (req, res) => {
  let shopId = req.params.shopId;
  const data = await models.store_analytics.findOne({
    where: { user_id: req.params.shopId, date: todayDate },
  });

  if (data) {
    await models.store_analytics.increment("message_clicks", {
      where: { id: data.id },
    });
  } else {
    await models.store_analytics.create({
      user_id: req.params.shopId,
      store_views: 1,
      message_clicks: 1,
    });
  }
  res.json({ status: true });
});

//get all instock products of user
router.get("/allproducts/:id/:cat", async (req, res) => {
  let response = {};
  if (req.params.cat == "all") {
    response = await models.products.findAll({
      where: { product_user: req.params.id, product_stock: { [Op.ne]: 0 } },
      include: [
        {
          model: models.products_images,
          as: "products_images",
        },
      ],
    });
  } else {
    response = await models.products.findAll({
      where: {
        product_user: req.params.id,
        product_stock: { [Op.ne]: 0 },
        product_cat: parseInt(req.params.cat),
      },
      include: [
        {
          model: models.products_images,
          as: "products_images",
        },
      ],
    });
  }

  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: response,
  });
});

// search products from store
router.get("/search/products/:storeId/:searchTerm", async (req, res) => {
  const searchResponse = await models.products.findAll({
    where: {
      product_stock: { [Op.ne]: 0 },
      product_user: req.params.storeId,
      product_name: { [Op.like]: "%" + req.params.searchTerm + "%" },
    },
    include: [
      {
        model: models.products_images,
        as: "products_images",
      },
    ],
  });
  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: searchResponse,
  });
});

module.exports = router;
