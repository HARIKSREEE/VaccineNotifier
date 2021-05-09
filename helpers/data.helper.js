const axiosHelper = require("./axio.helper");

const sendGridHelper = require("./send-grid.helper");

const configHelper = require("./config.helper");

const HtmlHelper = require("./html.helper");

const Util = require("./util");

const sampleResponse = {
  centers: [
    {
      district_name: "Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      sessions: [
        {
          available_capacity: 10,
          date: "08-05-2021", // date,
          min_age_limit: 45,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 4,
          date: "08-05-2021", // date,
          min_age_limit: 45,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 0,
          date: "08-05-2021", // date,
          min_age_limit: 18,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
        },
      ],
    },
    {
      district_name: "Thiruvananthapuram", //district name
      block_name: "", //block name
      address: "MCh", //place name
      from: "9:00Am", //time,
      to: "06:00PM", //time
      name: "SCT", //center name
      pincode: "695027",
      sessions: [
        {
          available_capacity: 8,
          date: "08-05-2021", // date,
          min_age_limit: 18,
          vaccine: "Covishield", //covishield/ covaxin
          slots: ["09:00AM-11:00AM", "09:00AM-11:00AM"],
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
    const centerData = data.data?.centers || [];
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
  checkAvalability: async () => {
    const dates = Util.getDateSpan(configHelper.dateSpan);
    let availableCenters = [];

    for (let i = 0; i < dates.length; i++) {
      const activeDate = dates[i];
      console.log("caling date", activeDate);
      const data = await DataHelper.getAvailabilityByDistrict(
        undefined,
        activeDate
      );
      let activeCentersForDate = DataHelper.findAvailableCenters(data);
      const foundCenters = availableCenters.map((center) => center.center_id);
      activeCentersForDate = activeCentersForDate.filter((center) => {
        return !foundCenters.includes(center.center_id);
      });
      if (activeCentersForDate.length > 0) {
        availableCenters = availableCenters.concat(activeCentersForDate);
      }
    }

    console.log("iteracted through dates");

    if (availableCenters.length > 0) {
      DataHelper.notifyAboutAvailableCenters(availableCenters);
    }
  },
  notifyAboutAvailableCenters: async (centers = []) => {
    const notificationData = [];
    for (let i = 0; i < centers.length; i++) {
      const availableSessions = (centers[i].sessions || []).filter(
        (session) => session.available_capacity > 0
      );
      const htmlData = HtmlHelper.generateLocationData(
        centers[i],
        availableSessions
      );
      notificationData.push(htmlData);
    }
    if (notificationData.length > 0) {
      const combinedHtml = `<div>${notificationData.join("")}</div>`;

      await sendGridHelper.sendMessage("Vaccine Available", combinedHtml);
    }
  },
};

module.exports = DataHelper;
