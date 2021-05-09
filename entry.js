const configHelper = require("./helpers/config.helper");
const dataHelper = require("./helpers/data.helper");

const util = require("./helpers/util");

(async () => {
  try {
    await dataHelper.checkAvalability();

    console.log("Initial call happened");
    console.log("Vaccine checker running...");
    setInterval(async () => {
      await dataHelper.checkAvalability();
      console.log("Called Api");
    }, 900000);

    setInterval(async () => {
      
      const overRideTime = configHelper.timeOverRide;
      const overRideHour = +overRideTime.slice(0, 2);
      const overRideMin = +overRideTime.slice(3, 5);

      const currentShortTime = util.getCurrentTimeShort();
      const currentTimeHour = +currentShortTime.slice(0, 2);
      const currentTimeMin = +currentShortTime.slice(3, 5);
      const currentTimeSecInms = +currentShortTime.slice(6, 8) * 1000;

      const plusMargin = 5000;
      const negativeMargin = 55 * 1000;

      if (
        overRideHour === currentTimeHour &&
        overRideMin === currentTimeMin &&
        (currentTimeSecInms <= plusMargin ||
          currentTimeSecInms >= negativeMargin)
      ) {
        await dataHelper.checkAvalability();
      }
    }, 5000);
  } catch (ex) {
    console.log("error", ex);
  }
})();
