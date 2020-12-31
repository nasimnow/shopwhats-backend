const mysqlConnection = require("../connection");
const express = require("express");
const router = express.Router();

//get all details of current store user
router.get("/:store", (req, res) => {
  let sql = `SELECT id,account_store,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address	 FROM account WHERE account_store_link = '${req.params.store}'`;
  let query = mysqlConnection.query(sql, (err, results) => {
    if (err)
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
router.get("/api/shop/:shop", (req, res) => {
  var midnight = new Date();

  midnight.setHours(24, 0, 0, 0);

  let shop = req.params.shop;
  if (!req.cookies["viewlist"]) {
    let arr = [shop];
    res.cookie("viewlist", JSON.stringify(arr), { expires: midnight });
  } else {
    let arr = JSON.parse(req.cookies["viewlist"]);
    if (arr.indexOf(shop) == -1) {
      arr.push(shop);
      res.cookie("viewlist", JSON.stringify(arr), { expires: midnight });
    }
  }

  res.send(midnight);
});

//get all instock products of user
router.get("/products/:id/:cat", (req, res) => {
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
    }
  );
});

module.exports = router;
