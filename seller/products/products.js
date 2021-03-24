const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const Jimp = require("jimp");
const deleteProductsByArray = require("../utils/deleteProducts");

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const products = require("../../models/products");
const fn = Sequilize.fn;
const lit = Sequilize.literal;

//get all products of current user
//returning images id with images after imagname:imageid
router.get("/", async (req, res) => {
  const response = await models.products.findAll({
    where: { product_user: req.user.user.id },
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
    data: response,
  });
});

//get count of all products of a user
router.get("/count", (req, res) => {
  const today = moment().format("YYYY-MM-DD");
  console.log(today);
  let sql = `select (select count(*) from products WHERE product_user=${req.user.user.id}) as products_count  ,
  (select count(*) from categories WHERE cat_user=${req.user.user.id}) as cat_count ,(select store_views from store_analytics WHERE user_id=${req.user.user.id} AND date='${today}') as store_views,(select message_clicks from store_analytics WHERE user_id=${req.user.user.id} AND date='${today}') as message_clicks`;
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
router.get("/:id", async (req, res) => {
  const response = await models.products.findByPk(req.params.id, {
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
    data: response,
  });
});

//add new product
router.post("/", async (req, res) => {
  const response = await models.products.create({
    ...req.body,
    product_user: req.user.user.id,
  });
  res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

//chnaged id from body to params
//update specific product
router.put("/:id", async (req, res) => {
  console.log(req.params.id);
  const response = await models.products.update(req.body, {
    where: { id: req.params.id },
  });
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

//delete specific product
router.delete("/:id", (req, res) => {
  //delete products and its images
  const response = deleteProductsByArray([req.params.id], req.user.user.id);
  if (!response)
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

//flip product stock status
router.put("/stock/:id", async (req, res) => {
  const response = await models.products.update(
    { product_stock: lit("NOT product_stock") },
    { where: { id: req.params.id, product_user: req.user.user.id } }
  );
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

//get all products of a specific catogory
router.get("/catogories/:cat", async (req, res) => {
  const response = await models.products.findAll({
    where: { product_user: req.user.user.id, product_cat: req.params.cat },
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
    data: response,
  });
});

let productStorage = multer.diskStorage({
  destination: function (req, res, callback) {
    let dir = "./product-images/min";
    let imageDir = "./product-images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, imageDir);
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({ storage: productStorage }).array("product_image", 6);
//upload product images to server
router.post("/imageupload/:productId", upload, async (req, res) => {
  let arrayDb = [];
  req.files.map((file) => arrayDb.push([req.params.productId, file.filename]));
  for (let i = 0; i < req.files.length; i++) {
    Jimp.read(req.files[i].path)
      .then((lenna) => {
        return lenna
          .resize(Jimp.AUTO, 400)
          .quality(60)
          .write("./product-images/min/" + req.files[i].filename);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  let sql = "INSERT INTO products_images (product_id, product_image) VALUES ?";
  console.log(arrayDb);
  let query = mysqlConnection.query(sql, [arrayDb], (err, result) => {
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
      data: { images: arrayDb },
    });
  });
});

//add product images to database
router.post("/imageAdd/:productId", (req, res) => {
  let arrayDb = [];
  req.body.product_images.map((file) =>
    arrayDb.push([req.params.productId, file])
  );
  let sql = "INSERT INTO products_images (product_id, product_image) VALUES ?";
  console.log(arrayDb);
  let query = mysqlConnection.query(sql, [arrayDb], (err, result) => {
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
      data: { images: arrayDb },
    });
  });
});

//remove already uploaded image from database
//sent images as array
router.post("/imageDelete/:pid", async (req, res) => {
  const imagestoDeleteId = req.body.images_delete.map((image) => image.id);
  const imagesToDeleteFiles = req.body.images_delete.map(
    (image) => image.product_image
  );
  const dbResponse = await models.products_images.destroy({
    where: { product_id: req.params.pid, id: imagestoDeleteId },
  });
  //delete images from storage
  for (let i = 0; i < imagesToDeleteFiles.length; i++) {
    try {
      fs.unlinkSync(`./product-images/${imagesToDeleteFiles[i]}`);
      fs.unlinkSync(`./product-images/min/${imagesToDeleteFiles[i]}`);
    } catch (error) {
      console.log("cant delete file");
    }
  }
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: dbResponse,
  });
});

module.exports = router;
