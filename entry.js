const dataHelper = require("./helpers/data.helper");

(async () => {
  try {
    await dataHelper.checkAvalability();
    console.log("Initial call happened");
    setInterval(async () => {
      await dataHelper.checkAvalability();
      console.log("Called Api");
    }, 900000);

    setInterval(async () => {
      console.log("Vaccine checker running...");
    }, 5000);
  } catch (ex) {
    console.log("error", ex);
  }
})();
