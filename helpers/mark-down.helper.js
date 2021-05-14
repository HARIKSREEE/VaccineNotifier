const TelegramDataHelper = {
  generateLocationData: (center, sessions = []) => {
    const addressData = `<b>District : </b><b>${center.district_name}</b>\n
  <b>Address : </b><b>${center.address}</b>\n
  Center name : ${center.name}\n
  Pincode : ${center.pincode}\n
  Time from : ${center.from}\n
  Time to : ${center.to}\n
  ${TelegramDataHelper.getSessionData(sessions)}`;
    return `${addressData}\n
    ******************************************
    ******************************************\n\n`;
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
       Slots : ${TelegramDataHelper.getSlotData(currentSession.slots || [])}\n
       <b>Age limit : </b><b>${currentSession.min_age_limit}</b>
  ${
    sessions.length > 1 && i !== sessions.length - 1
      ? "\n++++++++++++++++++++++++++++++++++\n\n"
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

module.exports = TelegramDataHelper;
