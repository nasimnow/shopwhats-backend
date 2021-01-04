const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();

// get all required data for the page requested
router.get("/:store", (req, res) => {
  let sqlStoreDetails = `SELECT id,account_store,account_whatsapp,account_store_link,account_store_status,account_store_desc,account_store_address	 FROM account WHERE account_store_link = '${req.params.store}'`;
  mysqlConnection.query(sqlStoreDetails, (error, storeDetails) => {
    if (error) return res.status(500).json({ status: false, error });
    if (storeDetails.length < 1)
      return res
        .status(404)
        .json({ status: false, error: "User Doesnt Exist" });
    let sqlCategoriesProducts = `SELECT * FROM catogories WHERE cat_user = '${storeDetails[0].id}';SELECT  products.* , GROUP_CONCAT(product_image ORDER BY products_images.id) AS images
    FROM    products 
    LEFT JOIN    products_images
    ON      products_images.product_id = products.id
    WHERE product_user='${storeDetails[0].id}' AND product_stock !=0
    GROUP BY products.id`;
    mysqlConnection.query(
      sqlCategoriesProducts,
      (error, categoriesProducts) => {
        if (error) return res.status(500).json({ status: false, error });
        return res.status(200).json({
          status: true,
          data: {
            storeinfo: storeDetails[0],
            categories: categoriesProducts[0],
            products: categoriesProducts[1],
          },
        });
      }
    );
  });
});

module.exports = router;
