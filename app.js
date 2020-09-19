if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const passport = require("passport");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("express-flash");
const cors = require("cors");
const mysqlConnection = require("./connection");
const FileStore = require("session-file-store")(session);

const app = express();

require("./seller/account/passport-config")(passport);
const PORT = process.env.PORT || 3000;

app.set("view-engine", "ejs");
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    genid: (req) => {
      return uuidv4();
    },
    store: new FileStore(),
    cookie: { maxAge: 172800000 },
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/seller/register", isNotLogin, require("./seller/account/register"));

app.use("/seller/login", isNotLogin, require("./seller/account/login"));

app.use("/seller/products", isLogin, require("./seller/products/products"));

app.use(
  "/seller/catogories",
  isLogin,
  require("./seller/catogories/catogories")
);

app.use("/seller/store", isLogin, require("./seller/account/store"));

app.get("/seller/loginstatus", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(201).json({
      message: { messageBody: "Loginned", status: true, login: true },
    });
  }
  return res.status(500).json({
    message: { messageBody: "Not Loginned", status: false, login: false },
  });
});

app.get("/seller/logout", isLogin, (req, res) => {
  req.logOut();
  res.json({ message: "succesfull Logggedout", login: false });
});

app.get("/upload", (req, res) => {
  res.render("upload.ejs");
});

function isLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    status: false,
    login: false,
    error: { message: "Please Login", code: 103 },
  });
}
function isNotLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(400).json({
      status: false,
      login: true,
      error: { message: "Already Loginned", code: 104 },
    });
  }
  return next();
}

app.post(
  "/uploadimage:id",
  uploader.array("product_image", 6),
  async (req, res, next) => {
    try {
      if (req.files.length > 0) {
        const response = await UploadStorageFirebase(req.files, req.params.id);
        return res.status(200).send(response);
      }
    } catch (error) {
      res.status(400).send(`Error, could not upload file: ${error}`);
      return;
    }
  }
);

const UploadStorageFirebase = (files, product_id) => {
  let prom = new Promise((_resolve, _reject) => {
    let arrayFile = [];
    let arrayDb = [];
    if (!files) {
      _reject("Not file");
    }
    files.map((filez) => {
      let fileName = filez.originalname + Date.now();
      // Create new blob in the bucket referencing the file
      const blob = bucket.file(fileName);

      // Create writable stream and specifying file mimetype
      const blobWriter = blob.createWriteStream({
        metadata: {
          contentType: filez.mimetype,
        },
      });

      blobWriter.on("error", (error) => {
        _reject(error);
      });

      blobWriter.on("finish", () => {
        // Assembling public URL for accessing the file via HTTP
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURI(blob.name)}?alt=media`;

        // Return the file name and its public URL
        arrayFile.push({
          fileName,
          fileLocation: publicUrl,
        });
        arrayDb.push([product_id, fileName]);
        if (arrayFile.length == files.length) {
          let sql =
            "INSERT INTO products_images (product_id, product_image) VALUES ?";
          let query = mysqlConnection.query(sql, [arrayDb], (err, result) => {
            if (err)
              return res
                .status(500)
                .json({ status: false, error: { message: err } });
            _resolve(arrayFile);
          });
        }
      });
      blobWriter.end(filez.buffer);
    });
  });
  return prom;
};

app.listen(PORT);
