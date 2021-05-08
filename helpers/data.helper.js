const axiosHelper = require("./axio.helper");

const sendGridHelper = require("./send-grid.helper");

const configHelper = require("./config.helper");

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
  getAvailabilityByDistrict: async (
    id = process.env.STATE_ID,
    date = process.env.DATE_CONFIG
  ) => {
    id == id ?? configHelper.stateId;
    date = date ?? configHelper.date;
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
    const data = await DataHelper.getAvailabilityByDistrict();
    const availableCenters = DataHelper.findAvailableCenters(data);

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
      const htmlData = DataHelper.generateLocationData(
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
  generateLocationData: (center, sessions = []) => {
    const addressData = `<ul>
      <li><span>District</span>&nbsp;<span>${center.district_name}</span></li>
      <li><span>Address</span>&nbsp;<span>${center.address}</span></li>
      <li><span>Center name</span>&nbsp;<span>${center.name}</span></li>
      <li><span>Pincode</span>&nbsp;<span>${center.pincode}</span></li>
      <li><span>Time from</span>&nbsp;<span>${center.from}</span></li>
      <li><span>Time to</span>&nbsp;<span>${center.to}</span></li>
    </ul>`;
    const sessionData = DataHelper.getSessionData(sessions);
    return `<div>${addressData + sessionData}</div>`;
  },
  getSessionData: (sessions = []) => {
    let data = "";
    if (sessions.length > 0) {
      data += "<li><ul>";
    }
    for (let i = 0; i < sessions.length; i++) {
      const currentSession = sessions[i];
      data += `<li><span>Availability</span>&nbsp;<span>${currentSession.available_capacity}</span></li>`;
      data += `<li><span>Date</span>&nbsp;<span>${currentSession.date}</span></li>`;
      data += `<li><span>Vaccine</span>&nbsp;<span>${currentSession.vaccine}</span></li>`;
      data += `<li><span>Slots</span>&nbsp;<span>${(
        currentSession.slots || []
      ).join("   ,   ")}</span></li>`;
      data += `<li><span>Age limi</span>&nbsp;<span>${currentSession.min_age_limit}</span></li>`;
      if (i === sessions.length - 1) {
        data += "</li></ul>";
      }
    }
    return data;
  },
};

module.exports = DataHelper;
