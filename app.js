const util = require("util");
const fs = require("fs");
const path = require("path");
const express = require("express");
var cors = require("cors");
const readDir = util.promisify(fs.readdir);
var multer = require("multer");
var upload = multer({ dest: "./images" });

async function getImageList(dir) {
  try {
    return await readDir(path.join(__dirname, "public", dir));
  } catch (error) {
    throw error;
  }
}

const app = express();

app.use(cors());

/* This is the endpoint that handles the upload. FilePond expects a unique id returned
   so it can request an undo if needed. The filename prop works well for this. */
app.post("/seller/products/uploadimage", upload.array("images", 12), function (
  req,
  res,
  next
) {
  // req.files is array of `photos` files
  console.log(req.files);
  // req.body will contain the text fields, if there were any
  console.log(req.body);
  res.send([req.files[0].filename]);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3001, () => console.log("Example app listening on port 3001!"));
