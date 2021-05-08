const dataHelper = require("./helpers/data.helper");

const configHelper = require("./helpers/config.helper");

(async () => {
  console.log("config", configHelper);
  await dataHelper.checkAvalability();
  setInterval(async () => {
    await dataHelper.checkAvalability();
  }, 900000);
  //await dataHelper.checkAvalability();
})();
