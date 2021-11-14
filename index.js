const TelegramBot = require('node-telegram-bot-api')
const TOKEN = "****"

const translate = require('@vitalets/google-translate-api')
const { findUser, createUser, setText } = require('./models/model')



const bot = new TelegramBot(TOKEN, {
    polling: true
})

bot.on('message', async (message) => {
    const text = message.text;
    if (text == '/start') {
        const chat_id = message.chat.id
        const { chat, message_id } = message;
        const name = message.from.first_name;
        bot.sendMessage(chat_id,
            `Salom <b>${name}</b>. Bu bot orqali siz o'zizga kerak bo'lgan so'zni tarjima qilishingiz mumkun!`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `Tarjima bulimiga`,
                                callback_data: `Tarjima bulimi`,
                            },
                        ],
                    ],
                },
            }
        );
    }
})




bot.on("callback_query", async (query) => {
    const { chat, message_id, text } = query.message;
    const Tarjima_bulimi = () => {
        bot.on('message', async (message) => {
            const chat_id = message.chat.id
            const message_id = message.message_id
            const name = message.from.first_name
            const text = message.text

            let user = await findUser(chat_id)

            if (!user) {
                await createUser(chat_id)
                await bot.sendMessage(chat_id, `Birorta so'z kiriting!`)
            } else {

                const keyboard = {
                    inline_keyboard: [
                        [
                            {
                                text: "UZ",
                                callback_data: 'uz'
                            },
                            {
                                text: "RU",
                                callback_data: 'ru'
                            },
                        ],
                        [
                            {
                                text: "EN",
                                callback_data: 'en'
                            },
                            {
                                text: "AR",
                                callback_data: 'ar'
                            },
                        ],
                    ]
                }

                await setText(chat_id, text)
                await bot.sendMessage(chat_id, text, {
                    reply_markup: keyboard
                })
            }
        })

        bot.on('callback_query', async (query) => {
            const data = query.data
            const chat_id = query.from.id
            const text = query.message.text

            let user = await findUser(chat_id)

            let translatedWord = await translate(text, { to: data })

            await bot.editMessageText(translatedWord.text, {
                chat_id,
                message_id: query.message.message_id
            })
        })
    }
    switch (query.data) {
        case "Tarjima bulimi":
            bot.deleteMessage(chat.id, message_id);
            const taj = `Tarjima qilmoqchi bo'lgan so'zizni kiriting`
            bot.sendMessage(chat.id, `${taj}🤗`)
            Tarjima_bulimi()
    }
});