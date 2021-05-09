const TelegramBot = require("node-telegram-bot-api");

const configHelper = require("./config.helper");

const TelegramHelper = {
  bot: new TelegramBot("", {}),
  initializeBot: () => {
    TelegramHelper.bot = new TelegramBot(configHelper.telegramKey, {
      polling: true,
    });
    TelegramHelper.bot.onText(/\/bravo (.+)/, (msg, match) => {
      const resp = match[1];
      TelegramHelper.bot.sendMessage(
        msg.chat.id,
        " This is a one side bot. Please dont send messages to Bot."
      );
    });
  },
  sendTelegramMessage: async (message) => {
    TelegramHelper.bot.sendMessage(configHelper.telegramChatId, message, {
      parse_mode: "HTML",
    });
  },
};

module.exports = TelegramHelper;
