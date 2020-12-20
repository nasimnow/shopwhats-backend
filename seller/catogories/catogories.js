const mysqlConnection = require("../../connection");
const express = require("express");
const router = express.Router();

//get all catogories of current user
router.get("/", (req, res) => {
  //let sql = `SELECT * FROM catogories WHERE cat_user=${req.user.user.id} `;
  let sql = `SELECT * FROM catogories c LEFT JOIN
  (SELECT product_cat, COUNT(*) AS product_count
    FROM products
    GROUP BY product_cat) p 
    ON c.id = p.product_cat WHERE cat_user=${req.user.user.id}`;
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

//get count of all catogories of a user
router.get("/count", (req, res) => {
  let sql = `SELECT COUNT(*) AS category_count FROM catogories WHERE cat_user=${req.user.user.id}`;

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

//get all parent catogories
router.get("/parent", (req, res) => {
  let sql = `SELECT *FROM catogories_main`;
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

//get parent catogory by id
router.get("/parent/:id", (req, res) => {
  let sql = `SELECT *FROM catogories_main WHERE id=${req.params.id}`;
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
//get specific catogories by id
router.get("/:id", (req, res) => {
  let sql = `SELECT *FROM catogories WHERE id=${req.params.id} AND cat_user=${req.user.user.id}`;
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
//delete a specif catogory by id
router.delete("/:id", (req, res) => {
  let sql = `DELETE FROM catogories  WHERE id =${req.params.id} AND cat_user =${req.user.user.id} `;
  let query = mysqlConnection.query(sql, (err, results) => {
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
router.post("/", (req, res) => {
  let cat = {
    cat_name: req.body.cat_name,
    cat_parent: req.body.cat_parent,
    cat_user: req.user.user.id,
  };
  let sql = "INSERT INTO catogories SET ?";
  let query = mysqlConnection.query(sql, cat, (err, result) => {
    if (err)
      return res.json({
        status_code: 500,
        status: false,
        error: { message: err },
      });
    return res.json({ status_code: 201, status: true, login: true, data: cat });
  });
});
//update a catogory by id
router.put("/", (req, res) => {
  let cat = { cat_name: req.body.cat_name, cat_parent: req.body.cat_parent };
  let sql = `UPDATE catogories SET ? WHERE id=${req.body.id}`;
  let query = mysqlConnection.query(sql, cat, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status_code: 500, status: false, error: { message: err } });
    return res.json({ status_code: 201, status: true, login: true, data: cat });
  });
});

module.exports = router;
