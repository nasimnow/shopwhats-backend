const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const Op = Sequilize.Op;

router.get("/:productId", async (req, res) => {
  const product = await models.products.findByPk(
    parseInt(req.params.productId),
    {
      include: [
        { model: models.products_images, as: "products_images" },
        {
          model: models.products_variants,
          as: "products_variants",
        },
      ],
    }
  );
  const storeinfo = await models.account.findByPk(product.product_user, {
    attributes: {
      exclude: ["account_password"],
    },
  });
  const similarproducts = await models.products.findAll({
    where: { product_user: storeinfo.id, product_stock: { [Op.ne]: 0 } },
    limit: 5,
  });
  return res.status(200).json({
    status: true,
    data: {
      storeinfo,
      product,
      similarproducts,
    },
  });
});

module.exports = router;
