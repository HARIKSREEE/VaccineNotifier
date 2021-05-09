const configHelper = require("./config.helper");

const Util = {
  getDateSpan: (span = 1) => {
    const dates = [];
    for (let i = 0; i < span; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      const date = Util.getCorrectDateFormat(currentDate);
      dates.push(date);
    }

    return dates;
  },
  getCorrectDateFormat: (date) => {
    const month = date.getMonth() + 1;
    const dateValue = date.getDate();
    return `${dateValue}-${month}-${date.getFullYear()}`;
  },
  getCurrentTimeShort: () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },
  checkIfOverrideNeeded: () => {
    const overRideTime = configHelper.timeOverRide;
    const overRideHour = +overRideTime.slice(0, 2);
    const overRideMin = +overRideTime.slice(3, 5);
    const overRideType = overRideTime.slice(9); // AM/PM

    const currentShortTime = Util.getCurrentTimeShort();
    const currentTimeHour = +currentShortTime.slice(0, 2);
    const currentTimeMin = +currentShortTime.slice(3, 5);
    const currentTimeType = currentShortTime.slice(9); // AM/PM
    const currentTimeSecInms = +currentShortTime.slice(6, 8) * 1000;

    const plusMargin = 5000; // plus 5 secs
    const negativeMargin = 55 * 1000; // last 5 seconds of previous minute

    const overrideNeeded =
      overRideHour === currentTimeHour &&
      overRideMin === currentTimeMin &&
      overRideType == currentTimeType &&
      (currentTimeSecInms <= plusMargin ||
        currentTimeSecInms >= negativeMargin);

        return overrideNeeded;
  },
};

module.exports = Util;
