const axiosHelper = require("./helpers/axio.helper");
const express = require("express");

const dotenv = require("dotenv");

const dataHelper = require("./helpers/data.helper");

const mailHelper = require("./helpers/send-grid.helper");

(async () => {
  const result = dotenv.config();

  console.log(process.env.SEND_GRID_API_KEY);
  // setInterval(async () => {
  //   await dataHelper.checkAvalability();
  // }, 1000);
  await dataHelper.checkAvalability();
})();
