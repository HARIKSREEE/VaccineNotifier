const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  endpoint: process.env.GET_API_URL,
  sendGridKey: process.env.SENDGRID_API_KEY,
};
