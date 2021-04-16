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
    where: { id: req.params.shopId, date: todayDate },
  });
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
  res.json(data);
});

//add store viewers analytics
router.get("/analytics/storeviews/:shopId", (req, res) => {
  let midnight = moment().tz("Asia/Kolkata").toDate();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setUTCHours(0, 0, 0, 0);
  //convert moment
  console.log(midnight);
  let shop = req.params.shopId;
  if (!req.cookies["viewlist"]) {
    addAnalytics(shop);
    let arr = [shop];
    res.cookie("viewlist", JSON.stringify(arr), {
      expires: midnight,
      sameSite: "none",
      secure: true,
    });
  } else {
    let arr = JSON.parse(req.cookies["viewlist"]);
    if (arr.indexOf(shop) == -1) {
      addAnalytics(shop);
      arr.push(shop);
      res.cookie("viewlist", JSON.stringify(arr), {
        expires: midnight,
        sameSite: "none",
        secure: true,
      });
    }
  }

  res.json({ status: true, login: true });
});

const addAnalytics = (shop) => {
  let sql = `SELECT COUNT(*) AS count  FROM store_analytics WHERE user_id=${shop} AND date='${todayDate}'`;
  mysqlConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    if (result[0].count == 0) {
      let analyticsData = {
        user_id: shop,
        store_views: 1,
        message_clicks: 0,
        date: todayDate,
      };
      let sqlAdd = `INSERT INTO store_analytics SET ?`;
      mysqlConnection.query(sqlAdd, analyticsData, (err, result) => {
        if (err) console.log(err);
      });
    } else {
      let sqlAdd = `UPDATE store_analytics SET store_views = store_views+1  WHERE user_id=${shop} AND date='${todayDate}' `;
      mysqlConnection.query(sqlAdd, (err, result) => {
        if (err) console.log(err);
      });
    }
  });
};

//update store whatsapp button clicks
router.get("/analytics/messagecount/:shopId", (req, res) => {
  let shop = req.params.shopId;
  let sql = `SELECT COUNT(*) AS count  FROM store_analytics WHERE user_id=${shop} AND date='${todayDate}'`;
  mysqlConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    if (result[0].count == 0) {
      let analyticsData = {
        user_id: shop,
        store_views: 1,
        message_clicks: 1,
      };
      let sqlAdd = `INSERT INTO store_analytics SET ?`;
      mysqlConnection.query(sqlAdd, analyticsData, (err, result) => {
        if (err) console.log(err);
        res.json(result);
      });
    } else {
      let sqlAdd = `UPDATE store_analytics SET message_clicks = message_clicks+1  WHERE user_id=${shop} AND date='${todayDate}' `;
      mysqlConnection.query(sqlAdd, (err, result) => {
        if (err) console.log(err);
        res.json(result);
      });
    }
  });
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
