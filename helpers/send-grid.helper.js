const sgMail = require("@sendgrid/mail");

const configHelper = require("./config.helper");



(() => {
  console.log("api key", configHelper.sendGridKey);
  sgMail.setApiKey(configHelper.sendGridKey);
})();

const msg = {
  to: "", // Change to your recipient
  from: "", // Change to your verified sender
  subject: "COWIN Vaccin availability",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

const SendGrid = {
  sendMessage: async (message, html) => {
    try {
      const config = SendGrid.getMessage(message, html);
      const result = await sgMail.send(config);
      console.log("mail sent");
    } catch (ex) {
      console.log("failed to send mail", ex);
    }
  },
  getMessage: (message, html) => {
    const updatedMessage = msg;
    updatedMessage.text = message;
    updatedMessage.html = html;
    updatedMessage.from = process.env.EMAIL_FROM;
    updatedMessage.to = process.env.EMAIL_TO;
    return updatedMessage;
  },
  setKey: () => {
   
  },
};

module.exports = SendGrid;
