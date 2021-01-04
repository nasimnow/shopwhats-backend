const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();

router.get("/:productId", (req, res) => {
  let sqlProductDetails = `SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE products.id =${req.params.productId} 
    GROUP BY products.id`;
  mysqlConnection.query(sqlProductDetails, (error, productDetails) => {
    if (error) return res.status(500).json({ status: false, error });
    if (productDetails.length < 1)
      return res
        .status(404)
        .json({ status: false, error: "Product Doesnt Exist" });

    let sqlStoreDetails = `SELECT id,account_store,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address FROM account WHERE id = '${productDetails[0].product_user}'`;
    mysqlConnection.query(sqlStoreDetails, (error, storeDetails) => {
      if (error) return res.status(500).json({ status: false, error });
      return res.status(200).json({
        status: true,
        data: {
          storeinfo: storeDetails[0],
          product: productDetails[0],
        },
      });
    });
  });
});

module.exports = router;
