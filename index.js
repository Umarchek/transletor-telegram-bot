const TelegramBot = require('node-telegram-bot-api')
const TOKEN = "2137017839:AAF_LjKwvHyAcCJ7kSmvoQXVI1a7gfBJNOE"

const bot = new TelegramBot(TOKEN, {
    polling: true
})