const HtmlHelper = {
  generateLocationData: (center, sessions = []) => {
    const addressData = `<ul>
          <li><span>District</span>&nbsp;<span>${center.district_name}</span></li>
          <li><span>Address</span>&nbsp;<span>${center.address}</span></li>
          <li><span>Center name</span>&nbsp;<span>${center.name}</span></li>
          <li><span>Pincode</span>&nbsp;<span>${center.pincode}</span></li>
          <li><span>Time from</span>&nbsp;<span>${center.from}</span></li>
          <li><span>Time to</span>&nbsp;<span>${center.to}</span></li>
        </ul>`;
    const sessionData = HtmlHelper.getSessionData(sessions);
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

module.exports = HtmlHelper;
