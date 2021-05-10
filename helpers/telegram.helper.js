const TelegramBot = require("node-telegram-bot-api");

const configHelper = require("./config.helper");

const TelegramHelper = {
  bot: new TelegramBot("", {}),
  initializeBot: () => {
    TelegramHelper.bot = new TelegramBot(configHelper.telegramKey, {
      polling: true,
    });
    TelegramHelper.bot.on("text", (message) => {
      const isUnTrackedMessage =
        (message.text || "").split(configHelper.botName)[0].trim() !==
        "/heartbeat";
      if (isUnTrackedMessage) {
        TelegramHelper.bot.sendMessage(
          message.chat.id,
          "This bot doesn't respond to user queries"
        );
      } else {
        TelegramHelper.bot.sendMessage(message.chat.id, "Bot is active..");
      }
    });
  },
  sendTelegramMessage: async (message) => {
    console.log("Telegram notification sent");
    TelegramHelper.bot.sendMessage(configHelper.telegramChatId, message, {
      parse_mode: "HTML",
    });
  },
};

module.exports = TelegramHelper;
