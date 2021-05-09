const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  endpoint: process.env.GET_API_URL,
  sendGridKey: process.env.SENDGRID_API_KEY,
  endpointHost: process.env.HOST_CONFIG,
  runtime: process.env.RUN_TIME,
  districtId: process.env.DISTRICT_ID,
  date: process.env.DATE_CONFIG,
  dateSpan: process.env.DATE_SPAN,
  timeOverRide: process.env.TIME_OVERRIDE,
  telegramKey: process.env.TELEGRAM_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID
};
