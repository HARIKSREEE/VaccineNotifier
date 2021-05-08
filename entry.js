const axiosHelper = require("./helpers/axio.helper");
const express = require("express");

const dotenv = require("dotenv");

const dataHelper = require("./helpers/data.helper");

const mailHelper = require("./helpers/send-grid.helper");

(async () => {
  const result = dotenv.config();

  console.log(process.env.SEND_GRID_API_KEY);
  await dataHelper.checkAvalability();
  setInterval(async () => {
    await dataHelper.checkAvalability();
  }, 900000);
  //await dataHelper.checkAvalability();
})();
