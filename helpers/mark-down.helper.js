const TelegramDataHelper = {
  generateLocationData: (center, sessions = []) => {
    const addressData = `<b>Address : </b><b>${center.address}</b>\n
Center name : ${center.name}\n
Pincode : ${center.pincode}\n
From: ${center.from}, To: ${center.to}\n
  ${TelegramDataHelper.getSessionData(sessions)}`;
    return `${addressData}\n
Register here \u2935
<b>https://selfregistration.cowin.gov.in/</b>\n\n`;
  },
  getSessionData: (sessions = []) => {
    let data = "";

    for (let i = 0; i < sessions.length; i++) {
      const currentSession = sessions[i];
      data += `     <b>Availability : </b><b>${
        currentSession.available_capacity
      }</b>
      Dose 1: <b>${
        currentSession.available_capacity_dose1
      }</b>
      Dose 2: <b>${currentSession.available_capacity_dose2}</b>\n
       Date : ${currentSession.date}\n
       <b>Vaccine : </b><b>${currentSession.vaccine}</b>\n
       <b>Age : </b><b>${getAgeInfo(currentSession.min_age_limit)}</b>${
        sessions.length > 1 && i !== sessions.length - 1
          ? "\n\n++++++++++++++++++++++++++++++++++\n\n"
          : ""
      }`;
    }
    return data;
  },
  getSlotData: (slots = []) => {
    let slotData = ``;
    slotData = slots.reduce((prevValue, slot) => {
      return `         ${prevValue}\n${slot}`;
    }, slotData);

    return slotData;
  },
};

const getAgeInfo = (value) => {
 return Number(value) === 45
    ? "45+"
    : Number(value) === 18
    ? "18 to 44"
    : "Not available";
};

module.exports = TelegramDataHelper;
