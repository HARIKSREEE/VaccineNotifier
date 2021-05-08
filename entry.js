const dataHelper = require("./helpers/data.helper");

const configHelper = require("./helpers/config.helper");

const express = require("express");
const app = express();
const port = 3000;

(async () => {
  console.log("config", configHelper);
  try {
    await dataHelper.checkAvalability();
    setInterval(async () => {
      await dataHelper.checkAvalability();
    }, 900000);
  } catch (ex) {
    console.log("error", ex);
  }
  //await dataHelper.checkAvalability();
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
