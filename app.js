const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
let cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(cors());

const sequelize = require("./dbconnection");
const initModels = require("./models/init-models");
const models = initModels(sequelize);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/test", (req, res) => {
  return res.send("its working");
});

app.use("/api/client/store", require("./client/store"));

app.use("/api/client/storehomepage", require("./client/pages/storeHome"));

app.use(
  "/api/client/productdetailedpage",
  require("./client/pages/productDetailed")
);

app.use("/api/seller/register", require("./seller/account/register"));

app.use("/api/seller/login", require("./seller/account/login"));

app.get("/api/dir", (req, res) => res.send(__dirname));

app.use("/api/product-images", express.static(__dirname + "/product-images"));
app.use("/api/profile-images", express.static(__dirname + "/profile-images"));
app.use("/api/seller/products", isLogin, require("./seller/products/products"));

app.use(
  "/api/seller/catogories",
  isLogin,
  require("./seller/catogories/catogories")
);

app.use("/api/seller/store", isLogin, require("./seller/account/store"));

app.get("/api/seller/loginstatus", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(201).json({
      message: { messageBody: "Loginned", status: true, login: true },
    });
  }
  return res.status(500).json({
    message: { messageBody: "Not Loginned", status: false, login: false },
  });
});

app.get("/api/seller/logout", (req, res) => {
  req.logOut();
  return res.json({ message: "succesfull Logggedout", login: false });
});

function isLogin(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];
    req.token = bearer;
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        return res.status(401).json({
          status_code: 400,
          status: false,
          login: false,
          error: { message: "Session Expired", code: 105 },
        });
      }
      req.user = authData;
      next();
    });
  } else {
    return res.status(401).json({
      status_code: 400,
      status: false,
      login: false,
      error: { message: "Please Login", code: 103 },
    });
  }
}

app.get("/api/imagesdump/", async (req, res) => {
  const images = await models.products_images.findAll();
  return res.json(images);
});

app.listen(PORT);
