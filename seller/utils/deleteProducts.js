const fs = require("fs");

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);

const deleteProductsByArray = async (productId, productUser) => {
  // get all images assosiated with the product
  const product_images = await models.products_images.findAll({
    where: { product_id: productId },
  });

  //delete images from storage
  for (let i = 0; i < product_images.length; i++) {
    try {
      fs.unlinkSync(`./product-images/${product_images[i].product_image}`);
      fs.unlinkSync(`./product-images/min/${product_images[i].product_image}`);
    } catch (error) {
      console.log(error);
    }
  }
  // delete images from databse
  await models.products_images.destroy({ where: { product_id: productId } });
  //delete variants from database
  await models.products_variants.destroy({ where: { product_id: productId } });
  // delete products from database
  await models.products.destroy({ where: { id: productId } });

  return true;
};

module.exports = deleteProductsByArray;
