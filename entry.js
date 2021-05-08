const dataHelper = require("./helpers/data.helper");

const configHelper = require("./helpers/config.helper");

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
