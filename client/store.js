const mysqlConnection = require("../connection");
const express = require("express");
const router = express.Router();

//get all details of current store user
router.get("/:store", (req, res) => {
  let sql = `SELECT id,account_store,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address	 FROM account WHERE account_store_link = '${req.params.store}'`;
  let query = mysqlConnection.query(sql, (err, results) => {
    if (err || results.length < 1)
      return res
        .status(500)
        .json({ message: { messageBody: err, status: false } });

    return res.status(201).json({ status: true, data: results });
  });
});

//get all categories of current store user
router.get("/categories/all/:userId", (req, res) => {
  let sql = `SELECT *	 FROM catogories WHERE cat_user = '${req.params.userId}'`;
  let query = mysqlConnection.query(sql, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: { messageBody: err, status: false } });

    return res.status(201).json({ status: true, data: results });
  });
});

//get specific product
router.get("/products/single/:id", (req, res) => {
  let sql = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.id =${req.params.id} 
    GROUP BY products.id`;
  let query = mysqlConnection.query(sql, (err, results) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 200,
      status: true,
      login: true,
      data: results,
    });
  });
});

//add store viewers analytics
router.get("/analytics/storeviews/:shopId", (req, res) => {
  let midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setUTCHours(0, 0, 0, 0);
  //convert moment

  let shop = req.params.shopId;
  if (!req.cookies["viewlist"]) {
    addAnalytics(shop);
    let arr = [shop];
    res.cookie("viewlist", JSON.stringify(arr), {
      expires: midnight,
      sameSite: "none",
    });
  } else {
    let arr = JSON.parse(req.cookies["viewlist"]);
    if (arr.indexOf(shop) == -1) {
      addAnalytics(shop);
      arr.push(shop);
      res.cookie("viewlist", JSON.stringify(arr), {
        expires: midnight,
        sameSite: "none",
      });
    }
  }

  res.json({ status: true, login: true });
});

const addAnalytics = (shop) => {
  let today = new Date();
  let todayDate =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let sql = `SELECT COUNT(*) AS count  FROM store_analytics WHERE user_id=${shop} AND date='${todayDate}'`;
  mysqlConnection.query(sql, (err, result) => {
    if (err) console.log(err);
    if (result[0].count == 0) {
      let analyticsData = {
        user_id: shop,
        store_views: 1,
        message_clicks: 0,
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
  let today = new Date();
  let todayDate =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
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
      });
    } else {
      let sqlAdd = `UPDATE store_analytics SET message_clicks = message_clicks+1  WHERE user_id=${shop} AND date='${todayDate}' `;
      mysqlConnection.query(sqlAdd, (err, result) => {
        if (err) console.log(err);
      });
    }
  });
});

//get all instock products of user
router.get("/allproducts/:id/:cat", (req, res) => {
  let sqlAll = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE product_user='${req.params.id}' AND product_stock !=0
    GROUP BY products.id`;

  //filter products by category if need
  let sqlCat = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.product_cat ='${req.params.cat}' AND product_stock !=0 AND product_user='${req.params.id}'
    GROUP BY products.id`;

  let query = mysqlConnection.query(
    req.params.cat == "all" ? sqlAll : sqlCat,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          status_code: 500,
          message: { messageBody: err, status: false },
        });
      }
      return res.json({
        status_code: 200,
        status: true,
        login: true,
        data: results,
      });
    }
  );
});

// search products from store
router.get("/search/products/:storeId/:keyword", (req, res) => {
  let sqlSearch = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE product_user='${req.params.storeId}' AND product_stock !=0 AND product_name LIKE '%${req.params.keyword}%'
    GROUP BY products.id`;
  let query = mysqlConnection.query(sqlSearch, (err, results) => {
    if (err)
      return res.json({
        status_code: 500,
        message: { messageBody: err, status: false },
      });
    return res.json({
      status_code: 200,
      status: true,
      login: true,
      data: results,
    });
  });
});

module.exports = router;
