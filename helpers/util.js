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
};

module.exports = Util;
