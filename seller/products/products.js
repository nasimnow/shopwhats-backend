const express = require("express");
const router = express.Router();
const moment = require("moment");
const deleteProductsByArray = require("../utils/deleteProducts");
const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const { DateTime } = require("luxon");
const lit = Sequilize.literal;

const Op = Sequilize.Op;

//get all products of current user

router.get("/", async (req, res) => {
  const response = await models.products.findAll({
    where: { product_user: req.user.user.id },
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
    order: [["id", "desc"]],
  });
  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: response,
  });
});

//get count of all products of a user
router.get("/count", async (req, res) => {
  let results;
  const userId = req.user.user.id;
  const today = DateTime.now().setZone("Asia/Kolkata").toISODate();
  const views = await models.store_analytics.findOne({
    attributes: ["store_views", "message_clicks"],
    where: { user_id: req.user.user.id, date: today },
  });
  const products_count = await models.products.count({
    where: { product_user: userId },
  });
  const cat_count = await models.categories.count({
    where: { cat_user: userId },
  });
  if (views) results = { ...views.dataValues, products_count, cat_count };
  else
    results = {
      store_views: null,
      message_clicks: null,
      products_count,
      cat_count,
    };
  console.log(results);

  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: results,
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
    data: response,
  });
});

//add new product
router.post("/", async (req, res) => {
  console.log(req.body);
  const response = await models.products.create(
    {
      ...req.body,
      product_user: req.user.user.id,
    },
    {
      include: [
        {
          model: models.products_variants,
          as: "products_variants",
        },
        {
          model: models.products_images,
          as: "products_images",
        },
      ],
    }
  );
  res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

//update specific product
router.put("/:id", async (req, res) => {
  ({
    products_variants_new,
    products_variants_old,
    products_images_new,
    products_images_old,
  } = req.body);

  //delete variants except
  await models.products_variants.destroy({
    where: {
      id: { [Op.notIn]: products_variants_old.map((variant) => variant.id) },
      product_id: req.params.id,
    },
  });

  //delete images except
  await models.products_images.destroy({
    where: {
      id: { [Op.notIn]: products_images_old.map((element) => element.id) },
      product_id: req.params.id,
    },
  });

  //add new variants
  await models.products_variants.bulkCreate(products_variants_new);
  //add new images
  await models.products_images.bulkCreate(
    products_images_new.map((element) => ({
      product_image: element,
      product_id: req.params.id,
    }))
  );

  //update existing variants
  products_variants_old.forEach(async (element) => {
    await models.products_variants.update(element, {
      where: { id: element.id },
    });
  });

  await models.products.update(req.body, {
    where: { id: req.params.id },
  });

  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: { status: true },
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

//add a variant to product
router.post("/variants", async (req, res) => {
  const response = await models.products_variants.bulkCreate(
    req.body.variants_array
  );

  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: response,
  });
});

//delete a variant by id
router.post("/variants/delete", async (req, res) => {
  const response = await models.products_variants.destroy({
    where: { id: req.body.variants_array },
  });
  return res.json({
    status_code: 200,
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
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: dbResponse,
  });
});

module.exports = router;
