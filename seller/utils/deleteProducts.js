const mysqlConnection = require("../../connection");
const fs = require("fs");

//pass array of product ids and user id to delete product
const deleteProductsByArray = (productId, productUser) => {
  console.log(productId);
  let sql = `DELETE FROM products  WHERE id in (${productId.join(
    ","
  )}) AND product_user =${productUser};
  SELECT product_image FROM products_images  WHERE product_id in (${productId.join(
    ","
  )})`;
  console.log(sql);
  mysqlConnection.query(sql, (err, result) => {
    if (err) return false;
    //delete images from storage
    for (let i = 0; i < result[1].length; i++) {
      try {
        fs.unlinkSync(`./product-images/${result[1][i].product_image}`);
        fs.unlinkSync(`./product-images/min/${result[1][i].product_image}`);
      } catch (error) {
        console.log(error);
      }
    }
    const sqlImageDelete = `DELETE FROM products_images where product_id in (${productId.join(
      ","
    )})`;
    mysqlConnection.query(sqlImageDelete, (err, result) => {
      if (err) console.log(err);
    });
  });
  return true;
};

module.exports = deleteProductsByArray;
