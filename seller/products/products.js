const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

//get all products of current user
//returning images id with images after imagname:imageid
router.get("/", (req, res) => {
  let sql = `SELECT  products.* , GROUP_CONCAT(products_images.product_image, ':',products_images.id  ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE product_user=${req.user.user.id}
    GROUP BY products.id`;
  //let sql = `SELECT *FROM products WHERE product_user=${user[0].id}`
  let query = mysqlConnection.query(sql, (err, results) => {
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

//get count of all products of a user
router.get("/count", (req, res) => {
  let sql = `select (select count(*) from products WHERE product_user=${req.user.user.id}) as products_count  ,
  (select count(*) from catogories WHERE cat_user=${req.user.user.id}) as cat_count  `;

  let query = mysqlConnection.query(sql, (err, results) => {
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
//get specific product
router.get("/:id", (req, res) => {
  let sql = `SELECT  products.* , GROUP_CONCAT(products_images.product_image, ':',products_images.id  ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.id =${req.params.id} AND products.product_user =${req.user.user.id}
    GROUP BY products.id`;
  //let sql = `SELECT *FROM products WHERE id =${req.params.id} AND product_user =${user[0].id}`
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

//add new product
router.post("/", (req, res) => {
  let product = {
    product_name: req.body.product_name,
    product_user: req.user.user.id,
    product_price: req.body.product_price,
    product_sale_price: req.body.product_sale_price,
    product_desc: req.body.product_desc,
    product_cat: req.body.product_cat,
  };
  let sql = "INSERT INTO products SET ?";
  let query = mysqlConnection.query(sql, product, (err, result) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 201,
      status: true,
      login: true,
      data: { product_id: result.insertId },
    });
  });
});

//update specific product
router.put("/", (req, res) => {
  let product = {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_sale_price: req.body.product_sale_price,
    product_desc: req.body.product_desc,
    product_stock: req.body.product_stock,
    product_cat: req.body.product_cat,
  };

  let sql = `UPDATE products  SET ? WHERE id =${req.body.id} AND product_user =${req.user.user.id}`;
  let query = mysqlConnection.query(sql, product, (err, result) => {
    //get images from product from
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 201,
      status: true,
      login: true,
      data: product,
    });
  });
});

//delete specific product
router.delete("/:id", (req, res) => {
  let sql = `DELETE FROM products  WHERE id =${req.params.id} AND product_user =${req.user.user.id} `;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 201,
      status: true,
      login: true,
      data: { id: req.params.id },
    });
  });
});

//flip product stock status
router.put("/stock/:id", (req, res) => {
  let sql = `UPDATE products  SET product_stock = NOT product_stock WHERE id=${req.params.id} AND product_user =${req.user.user.id}`;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 201,
      status: true,
      login: true,
      data: { id: req.params.id },
    });
  });
});

//get all products of a specific catogory
router.get("/catogories/:cat", (req, res) => {
  let sql = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.product_cat =${req.params.cat} AND products.product_user =${req.user.user.id}
    GROUP BY products.id`;
  // let sql = `SELECT *FROM products WHERE product_cat =${req.params.cat} AND product_user =${user[0].id}`
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

//get no of products under a catogory
router.get("/catogories/no/:cat", (req, res) => {
  let sql = `SELECT COUNT(*) AS count FROM products WHERE product_cat =${req.params.cat} AND product_user =${req.user.user.id}`;
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
      data: { products_count: results[0].count },
    });
  });
});

let productStorage = multer.diskStorage({
  destination: function (req, res, callback) {
    let dir = "./product-images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});

//upload product images to server
router.post("/imageupload/:pid", (req, res) => {
  let upload = multer({ storage: productStorage }).array("product_image", 6);
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    }

    let arrayDb = [];
    req.files.map((file) => arrayDb.push([req.params.pid, file.filename]));
    let sql =
      "INSERT INTO products_images (product_id, product_image) VALUES ?";
    let query = mysqlConnection.query(sql, [arrayDb], (err, result) => {
      if (err)
        return res.json({
          status_code: 500,
          status: false,
          error: { message: err },
        });
    });
    return res.json({
      status_code: 200,
      status: true,
      login: true,
      data: { images: arrayDb },
    });
  });
});

//remove already uploaded image from database
router.post("/imageDelete/:pid", (req, res) => {
  let imagesTodelete = req.body.images_delete;
  console.log(req.body);
  let sql = `DELETE FROM products_images WHERE product_id=${
    req.params.pid
  } AND id NOT
IN(${imagesTodelete.join(",")})`;
  let query = mysqlConnection.query(sql, (err, result) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({
      status_code: 201,
      status: true,
      login: true,
      data: result,
    });
  });
});

module.exports = router;
