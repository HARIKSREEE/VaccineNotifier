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
  await dataHelper.checkAvailability(restartFromError);
  console.log("Api call done");
  console.log("Vaccine checker running...");

  if (isFromError) {
    persistanceHelper.clearLastScheduler();
  }

  const interval = setInterval(async () => {
    await dataHelper.checkAvailability(restartFromError);
    exceptionTimeDelay = 0;
    console.log("Polling done: ", new Date().toLocaleTimeString());
  }, mainPollingTimeout);

  persistanceHelper.setLastScheduler(interval);

  if (!isFromError) {
    timeOverrideChecker();
  }
};

const timeOverrideChecker = async () => {
  console.log("Over ride time checker running...");
  setInterval(async () => {
    console.log("Override polling: ", new Date().toLocaleTimeString());

    if (!hasOverrideHappened && utilHelper.checkIfOverrideNeeded()) {
      hasOverrideHappened = true;
      console.log("Override call happened");
      await dataHelper.checkAvailability(restartFromError);
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
