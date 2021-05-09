const PersistanceHelper = {
  hasErrorOccured: false,
  lastRestartTimeout: "",
  lastErrorOccured: 0,
  lastScheduler: "",
  setHasErrorOccured: (value) => {
    PersistanceHelper.hasErrorOccured = value;
  },
  setLastErrorOccured: (value) => {
    PersistanceHelper.lastErrorOccured = value;
  },
  getHasErrorOccured: () => PersistanceHelper.lastErrorOccured,
  getLastErrorOccured: () => PersistanceHelper.lastErrorOccured,
  setLastScheduler: (interval) => {
    PersistanceHelper.lastScheduler = interval;
  },
  setLastRestartTimeout: (timeout) => {
    PersistanceHelper.lastRestartTimeout = timeout;
  },
  clearLastRestartTimeout: () => {
    if (PersistanceHelper.lastRestartTimeout) {
      clearTimeout(PersistanceHelper.lastRestartTimeout);
    }
  },
  clearLastScheduler: () => {
    if (PersistanceHelper.lastScheduler) {
      console.log("cleared last scheduler");
      clearInterval(PersistanceHelper.lastScheduler);
    }
  },
};

module.exports = PersistanceHelper;
