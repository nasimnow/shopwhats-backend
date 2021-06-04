const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/contract/:name", async (req, res) => {
  if (
    fs
      .readdirSync(`${__dirname}/contracts`)
      .filter((cntr) => cntr.slice(0, -3) === req.params.name)
  ) {
    return res.send(
      await require("./contracts/" + req.params.name + ".js")(
        ...req.body.values
      )
    );
  }

  return res.send(false);
});

module.exports = router;
