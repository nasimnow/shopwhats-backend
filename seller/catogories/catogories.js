const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();
const deleteProductsByArray = require("../utils/deleteProducts");

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const products = require("../../models/products");
const fn = Sequilize.fn;
const col = Sequilize.col;

// get all categorries of current user

router.get("/", async (req, res) => {
  const results = await models.categories.findAll({
    where: { cat_user: req.user.user.id },
    attributes: {
      include: [[fn("COUNT", col("products.product_cat")), "product_count"]],
    },
    include: [
      {
        model: models.products,
        as: "products",
        attributes: [],
        required: false,
      },
    ],
    group: ["categories.id"],
  });

  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: results,
  });
});

//get all parent catogories
router.get("/parent", async (req, res) => {
  const results = await models.categories_main.findAll();
  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: results,
  });
});

//get parent catogory by id
router.get("/parent/:id", async (req, res) => {
  const results = await models.categories_main.findByPk(
    parseInt(req.params.id)
  );
  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: results,
  });
});
//get specific catogories by id
router.get("/:id", async (req, res) => {
  const results = await models.categories.findOne({
    where: {
      id: parseInt(req.params.id),
      cat_user: req.user.user.id,
    },
  });

  return res.json({
    status_code: 200,
    status: true,
    login: true,
    data: results,
  });
});

//delete a category by id (deletes products under it and its images)
router.delete("/:id", async (req, res) => {
  const products = await models.products.findAll({
    where: {
      product_user: req.user.user.id,
      product_cat: parseInt(req.params.id),
    },
  });
  //extract productids from products
  let productIds = products.map((product) => product.id);
  //delete products and images from db and images from files
  let deleteResponse = await deleteProductsByArray(
    productIds,
    req.user.user.id
  );
  await models.categories.destroy({
    where: { id: parseInt(req.params.id), cat_user: req.user.user.id },
  });

  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: { id: req.params.id },
  });
});

//add new Category
router.post("/", async (req, res) => {
  const response = await models.categories.create({
    ...req.body,
    cat_user: req.user.user.id,
  });
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

//update a catogory by id

//THE WAY WE RECIEVE ID IS CHANGED FROM REQ TO PARAMS
router.put("/:catId", async (req, res) => {
  const response = await models.categories.update(
    { ...req.body },
    { where: { id: req.params.catId } }
  );
  return res.json({
    status_code: 201,
    status: true,
    login: true,
    data: response,
  });
});

module.exports = router;
