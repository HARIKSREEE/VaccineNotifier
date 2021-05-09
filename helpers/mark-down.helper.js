const TelegramDataHelper = {
  generateLocationData: (center, sessions = []) => {
    const addressData = `<b>District : </b><b>${center.district_name}</b>\n
              <b>Address : </b><b>${center.address}</b>\n
              <b>Center name : </b><b>${center.name}</b>\n
              <b>Pincode : </b><b>${center.pincode}</b>\n
              <b>Time from : </b><b>${center.from}</b>\n
              <b>Time to : </b><b>${center.to}</b>\n
              ${TelegramDataHelper.getSessionData(sessions)}`;
    return `${addressData}\n
    ************************\n`;
  },
  getSessionData: (sessions = []) => {
    let data = "";

    for (let i = 0; i < sessions.length; i++) {
      const currentSession = sessions[i];
      data += `<b>Availability : </b><b>${
        currentSession.available_capacity
      }</b>\n
                <b>Date : </b><b>${currentSession.date}</b>\n
                <b>Vaccine : </b><b>${currentSession.vaccine}</b>\n
                <b>Slots : </b>
                            ${TelegramDataHelper.getSlotData(
                              currentSession.slots || []
                            )}
                <b>Age limit : </b><b>${currentSession.min_age_limit}</b>\n`;
    }
    return data;
  },
  getSlotData: (slots = []) => {
    let slotData = "";
    slots.forEach((slot) => {
      slotData = slotData.concat(`<b>${slot}</b>\n\n`);
    });

    return slotData;
  },
};

module.exports = TelegramDataHelper;
