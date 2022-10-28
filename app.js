const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
let cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
//twilio for text message
// const twilio = require("twilio");

// //twilio requirements -- Texting API
// const accountSid = "ACe69b284822d5597964796af5e0c31f26";
// const authToken = "a0ab1dcb2bb7379c1d9725da6d97de03";
// const client = new twilio(accountSid, authToken);

require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(morgan("tiny"));
app.use(cors());

// //Twilio
// app.get("/send-text", (req, res) => {
//   //_GET Variables
//   const { recipient, textmessage } = req.query;

//   //Send Text
//   client.messages
//     .create({
//       body: textmessage,
//       to: recipient, // Text this number
//       from: "+18434387145", // From a valid Twilio number
//     })
//     .then((message) => {
//       res.send({
//         status_code: 200,
//         status: true,
//         message: "Text Sent",
//         data: message,
//       });
//     })
//     .catch((err) => {
//       res.send({
//         status_code: 500,
//         status: false,
//         message: "Text Failed",
//         data: err,
//       });
//     });
// });

const { expressSharp, HttpAdapter } = require("express-sharp");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/test", (req, res) => {
  return res.send("its working");
});

app.use("/api/client/store", require("./client/store"));

app.use("/api/client/products", require("./client/products"));

app.use("/api/client/storehomepage", require("./client/pages/storeHome"));
app.use("/api/client/links", require("./client/pages/linksFront"));

app.use(
  "/api/client/productdetailedpage",
  require("./client/pages/productDetailed")
);

app.use("/api/payment", require("./payment/payment"));

app.use("/api/scripts", require("./scripts/scripts"));

app.use("/api/seller/register", require("./seller/account/register"));

app.use("/api/seller/settings", isLogin, require("./seller/account/settings"));

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

app.use("/api/seller/links", isLogin, require("./seller/links/links"));

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

const imageHttpAdapter = new HttpAdapter({
  prefixUrl: "",
});

app.use(
  "/image-scaler",
  expressSharp({
    autoUseWebp: true,
    imageAdapter: imageHttpAdapter,
  })
);

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

app.listen(PORT);
