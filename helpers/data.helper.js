const axiosHelper = require("./axio.helper");

const sendGridHelper = require("./send-grid.helper");

const configHelper = require("./config.helper");

const HtmlHelper = require("./html.helper");

const Util = require("./util");

const persistanceHelper = require("./persistance.helper");

const telegramDataHelper = require("./mark-down.helper");

const teleGramHelper = require("./telegram.helper");

const emailSentTimeout = 1800000;

const sampleResponse = {
  centers: [
    {
      district_name: "Dummy - Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      sessions: [
        {
          available_capacity: 10,
          available_capacity_dose1: 3,
          available_capacity_dose2: 7,
          date: "08-05-2021", // date,
          min_age_limit: 45,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Dummy - Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 4,
          available_capacity_dose1: 4,
          available_capacity_dose2: 0,
          date: "08-05-2021", // date,
          min_age_limit: 45,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Dummy - Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 0,
          available_capacity_dose1: 0,
          available_capacity_dose2: 0,
          date: "08-05-2021", // date,
          min_age_limit: 18,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Dummy - Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 8,
          available_capacity_dose1: 4,
          available_capacity_dose2: 4,
          date: "08-05-2021", // date,
          min_age_limit: 18,
          vaccine: "Covishield", //covishield/ covaxin
          slots: [
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
          ],
        },
        {
          available_capacity: 8,
          available_capacity_dose1: 1,
          available_capacity_dose2: 7,
          date: "08-05-2021", // date,
          min_age_limit: 18,
          vaccine: "Covishield", //covishield/ covaxin
          slots: [
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
            "09:00AM-11:00AM",
          ],
        },
      ],
    },
  ],
};

const config = {
  headers: {
    accept: "application/json",
    host: "",
    "User-Agent": "",
    "Access-Control-Allow-Origin": "*",
  },
};

const getDistrictUrl = (id, date) => {
  return `${configHelper.endpoint}?district_id=${id}&date=${date}`;
};

const DataHelper = {
  getAvailabilityByDistrict: async (id = undefined, date = undefined) => {
    id = id ? id : configHelper.districtId;
    date = date ? date : configHelper.date;
    const url = getDistrictUrl(id, date);
    const updatedConfig = config;
    config.headers.host = configHelper.endpointHost;
    config.headers["User-Agent"] = configHelper.runtime;
    return await axiosHelper.get(url, updatedConfig);
  },
  findAvailableCenters: (data) => {
    if (!data.data) {
      console.log("invalid data for checking");
      return;
    }
    const availableCenters = [];
    const centerData = sampleResponse.centers || data.data?.centers || [];
    const centerCount = centerData?.length;
    for (let i = 0; i < centerCount; i++) {
      const currentCenter = centerData[i];
      const centerSessions = currentCenter.sessions || [];
      const hasAvailability = centerSessions.some(
        (session) =>
          session.available_capacity > 0 &&
          +session.min_age_limit >= process.env.MIN_AGE
      );
      if (hasAvailability) {
        availableCenters.push(centerData[i]);
      }
    }

    return availableCenters;
  },
  checkAvailability: async (callback) => {
    try {
      const dates = Util.getDateSpan(configHelper.dateSpan);
      let availableCenters = [];

      for (let i = 0; i < dates.length; i++) {
        const activeDate = dates[i];
        console.log("calling date", activeDate);
        const data = await DataHelper.getAvailabilityByDistrict(
          undefined,
          activeDate
        );

        persistanceHelper.setLastErrorOccurred(0);
        persistanceHelper.setHasErrorOccurred(false);
        let activeCentersForDate = DataHelper.findAvailableCenters(data);
        const foundCenters = availableCenters.map((center) => center.center_id);
        activeCentersForDate = activeCentersForDate.filter((center) => {
          return !foundCenters.includes(center.center_id);
        });
        if (activeCentersForDate.length > 0) {
          availableCenters = availableCenters.concat(activeCentersForDate);
        }
      }

      console.log("Iterated through dates");

      if (availableCenters.length > 0) {
        console.log("Found vaccine centers with availability");
        DataHelper.notifyAboutAvailableCenters(availableCenters);
      }
    } catch (ex) {
      console.log("error occurred");

      const lastErrorOccurred = persistanceHelper.getLastErrorOccured();
      const currentTime = new Date().getTime();
      if (currentTime - lastErrorOccurred >= emailSentTimeout) {
        sendGridHelper.sendErrorNotification(
          "Error occurred during data fetch"
        );
        persistanceHelper.setLastErrorOccurred(new Date().getTime());
      }
      persistanceHelper.setHasErrorOccurred(true);
      callback(true);
    }
  },
  notifyAboutAvailableCenters: async (centers = []) => {
    const notificationData = [];
    const telNotificationData = [];
    for (let i = 0; i < centers.length; i++) {
      const availableSessions = (centers[i].sessions || []).filter(
        (session) => session.available_capacity > 0
      );
      const htmlData = HtmlHelper.generateLocationData(
        centers[i],
        availableSessions
      );
      const telData = telegramDataHelper.generateLocationData(
        centers[i],
        availableSessions
      );
      notificationData.push(htmlData);
      telNotificationData.push(telData);
    }
    if (notificationData.length > 0) {
      //const combinedHtml = `<div>${notificationData.join("")}</div>`;
      //const teleCombinedData = `${telNotificationData.join("")}`;
      await teleGramHelper.sendMultipleTelegramMessage(telNotificationData);
      // Disabling the email feature since telegram is more convenient
      //await sendGridHelper.sendMessage("Vaccine Available", combinedHtml);
    }
  },
};

module.exports = DataHelper;
