const configHelper = require("./helpers/config.helper");
const dataHelper = require("./helpers/data.helper");

const utilHelper = require("./helpers/util");

const persistanceHelper = require("./helpers/persistance.helper");

const TelegramHelper = require("./helpers/telegram.helper");

const retryTimeout = 120000;

const overridePollTimeout = 5000;

const mainPollingTimeout = 900000;

let hasOverrideHappened = false;

const restartFromError = async () => {
  persistanceHelper.clearLastRestartTimeout();
  const timeOut = setTimeout(async () => {
    console.log("restarting after error");
    await startChecking(true);
  }, retryTimeout);
  persistanceHelper.setLastRestartTimeout(timeOut);
};

const startChecking = async (isFromError) => {
  await dataHelper.checkAvalability(restartFromError);
  console.log("Api call done");
  console.log("Vaccine checker running...");

  if (isFromError) {
    persistanceHelper.clearLastScheduler();
  }

  const interval = setInterval(async () => {
    await dataHelper.checkAvalability(restartFromError);
    exceptionTimeDelay = 0;
    console.log("Polling done");
  }, mainPollingTimeout);

  persistanceHelper.setLastScheduler(interval);

  if (!isFromError) {
    timeOverrideChecker();
  }
};

const timeOverrideChecker = async () => {
  console.log("Over ride time checker running...");
  setInterval(async () => {
    console.log("Override polling");

    if (!hasOverrideHappened && utilHelper.checkIfOverrideNeeded()) {
      hasOverrideHappened = true;
      console.log("Overide call happened");
      await dataHelper.checkAvalability(restartFromError);
    }
  }, overridePollTimeout);
};

(async () => {
  try {
    TelegramHelper.initializeBot();
    console.log("Initialized");
    await startChecking();
  } catch (ex) {
    console.log("error", ex);
  }
})();
