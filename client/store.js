const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");

const sequelize = require("../dbconnection");
const initModels = require("../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const { DateTime } = require("luxon");
const fn = Sequilize.fn;
const col = Sequilize.col;
const Op = Sequilize.Op;

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
  if (req.params.storeId) {
    const results = await models.account.findByPk(req.params.storeId);
    if (results.length < 1)
      return res
        .status(400)
        .json({ message: { messageBody: err, status: false } });

    return res.status(201).json({ status: true, data: results });
  }
  return res.status(400).json({ message: { messageBody: err, status: false } });
});

router.get("/analytics/storeviewsnew/:shopId", async (req, res) => {
  const todayDate = DateTime.now()
    .setZone("Asia/Kolkata")
    .toISODate()
    .toString();

  try {
    const data = await models.analytics.findOne({
      where: { user_id: req.params.shopId, event_date: todayDate },
    });
    console.log(data);

    if (data) {
      await models.analytics.increment("store_views", {
        where: { id: data.id },
      });
    } else {
      await models.analytics.create({
        user_id: +req.params.shopId,
        store_views: 1,
        message_clicks: 0,
        event_date: todayDate,
      });
    }
    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
});

//record category click
router.get("/analytics/catclick/:id", async (req, res) => {
  await models.categories.increment("cat_clicks", {
    where: { id: req.params.id },
  });
  return res.json({ status: "success" });
});

//record product click
router.get("/analytics/productclick/:id", async (req, res) => {
  await models.products.increment("product_clicks", {
    where: { id: req.params.id },
  });
  return res.json({ status: "success" });
});

//update store whatsapp button clicks
router.get("/analytics/messagecount/:shopId", async (req, res) => {
  const todayDate = DateTime.now()
    .setZone("Asia/Kolkata")
    .toISODate()
    .toString();

  try {
    const data = await models.analytics.findOne({
      where: { user_id: req.params.shopId, event_date: todayDate },
    });
    if (data) {
      await models.analytics.increment("message_clicks", {
        where: { id: data.id },
      });
    } else {
      await models.analytics.create({
        user_id: +req.params.shopId,
        store_views: 1,
        message_clicks: 1,
        event_date: todayDate,
      });
    }
    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
});

//get all instock products of user
router.get(
  "/allproducts/:id/:cat/:sortname/:sortmode/:pageno",
  async (req, res) => {
    const storeId = +req.params.id;
    const productCat = req.params.cat;
    const pageNo = +req.params.pageno;
    const limit = 10;
    let offset = limit * pageNo - limit;
    let productCount = 0;

    let response = {};
    if (["all", "popular"].includes(productCat)) {
      productCount = await models.products.count({
        where: { product_user: storeId, product_stock: { [Op.ne]: 0 } },
      });
      response = await models.products.findAll({
        where: { product_user: req.params.id, product_stock: { [Op.ne]: 0 } },
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
        order: [
          [req.params.sortname, req.params.sortmode],
          ["id", "desc"],
        ],
      });
    } else {
      productCount = await models.products.count({
        where: {
          product_user: req.params.id,
          product_stock: { [Op.ne]: 0 },
          product_cat: +productCat,
        },
      });
      response = await models.products.findAll({
        where: {
          product_user: req.params.id,
          product_stock: { [Op.ne]: 0 },
          product_cat: +productCat,
        },
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
        order: [[req.params.sortname, req.params.sortmode]],
      });
    }

    return res.json({
      status_code: 200,
      status: true,
      login: true,
      isLastPage: limit * pageNo >= productCount,
      data: response,
    });
  }
);

//get current account no
router.get("/status/storecount", async (req, res) => {
  const response = await models.account.count();
  const responseNames = await models.account.findAll({
    limit: 10,
    order: [["id", "desc"]],
  });
  return res.json({ count: response, names: responseNames });
});

//get store anlaytics in bulk
router.get("/status/views", async (req, res) => {
  const responseViews = await models.analytics.findAll({
    where: { event_date: todayDate },
    attributes: {
      include: [
        [fn("SUM", col("analytics.store_views")), "total_views"],
        [fn("SUM", col("analytics.message_clicks")), "total_clicks"],
      ],
    },
  });
  const responseStore = await models.analytics.findAll({
    where: { event_date: todayDate },
    order: [["store_views", "desc"]],

    include: [
      {
        model: models.account,
        as: "user",
      },
    ],
  });
  res.json({
    total_views: responseViews[0].dataValues.total_views,
    total_clicks: responseViews[0].dataValues.total_clicks,
    stores: responseStore,
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
      {
        model: models.products_variants,
        as: "products_variants",
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
