const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
var cookieParser = require("cookie-parser");

require("dotenv").config();
const PORT = process.env.PORT || 5000;
//cors plugin not working
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");

  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/client/store", require("./client/store"));

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

app.get("/api/shop/:shop", (req, res) => {
  var midnight = new Date();

  midnight.setHours(24, 0, 0, 0);

  let shop = req.params.shop;
  if (!req.cookies["viewlist"]) {
    let arr = [shop];
    res.cookie("viewlist", JSON.stringify(arr), { expires: midnight });
  } else {
    let arr = JSON.parse(req.cookies["viewlist"]);
    if (arr.indexOf(shop) == -1) {
      arr.push(shop);
      res.cookie("viewlist", JSON.stringify(arr), { expires: midnight });
    }
  }

  res.send(midnight);
});
function isLogin(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ")[1];
    req.token = bearer;
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        return res.json({
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
    return res.json({
      status_code: 400,
      status: false,
      login: false,
      error: { message: "Please Login", code: 103 },
    });
  }
}

app.listen(PORT);
