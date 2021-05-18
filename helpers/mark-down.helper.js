const TelegramDataHelper = {
  generateLocationData: (center, sessions = []) => {
    const addressData = `<b>Address : </b><b>${center.address}</b>\n
Center name : ${center.name}\n
Pincode : ${center.pincode}\n
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
      }</b>\n
       Date : ${currentSession.date}\n
       <b>Vaccine : </b><b>${currentSession.vaccine}</b>\n
       <b>Age limit : </b><b>${currentSession.min_age_limit}</b>${
    sessions.length > 1 && i !== sessions.length - 1
      ? "\n\n++++++++++++++++++++++++++++++++++\n\n"
      : ""}`;
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

module.exports = TelegramDataHelper;
