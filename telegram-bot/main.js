/* Start Handle Telegram Bot Events */

const token = "6208009889:AAHn2kqO2IS2ojG-dYpNpOBcOCp1pWgvAXo";

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });

const channelId = "@Civil_Engineering_TU";

const channeURL = "https://t.me/Civil_Engineering_TU";

let userChoises = {};

const BASE_API_URL = require("../global/BASE_API_URL");

const { getCustomSubjects, getCustomFile, processUserChoices } = require("./functions");

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    await bot.sendMessage(chatId, "مرحباً بك في البوت الخاص بنا");
    const memberInfo = await bot.getChatMember(channelId, userId);
    if (memberInfo.status === "left") {
        await bot.sendMessage(chatId, "عذراً أنت لست مشتركاً في قناتنا الرجاء الاشترك على الرابط : " + channeURL);
    } else {
        await bot.sendMessage(chatId, "الرجاء اختيار السنة", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "سنة أولى", callback_data: "first-year" }],
                    [{ text: "سنة ثانية", callback_data: "second-year" }],
                    [{ text: "سنة ثالثة", callback_data: "third-year" }],
                    [{ text: "سنة رابعة", callback_data: "fourth-year" }],
                    [{ text: "سنة خامسة", callback_data: "fifth-year" }],
                ],
            }
        })
    }
});

bot.on("callback_query", async (query) => {
    const selectedValue = query.data;
    const chatId = query.message.chat.id;
    if (!userChoises[chatId]) {
        userChoises[chatId] = { year: null, season: null, service: null, fileId: null };
    }
    if (selectedValue === "first-year"
        || selectedValue === "second-year"
        || selectedValue === "third-year"
        || selectedValue === "fourth-year"
        || selectedValue === "fifth-year"
    ) {
        userChoises[chatId].year = selectedValue;
        await bot.sendMessage(chatId, "الرجاء اختيار الفصل", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "فصل أول", callback_data: "first-season" }],
                    [{ text: "فصل ثاني", callback_data: "second-season" }],
                ],
            }
        });
    } else if (selectedValue === "first-season" || selectedValue === "second-season") {
        userChoises[chatId].season = selectedValue;
        await bot.sendMessage(chatId, "الرجاء اختيار الخدمة المطلوبة", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "محاضرات", callback_data: "lectures" }],
                    [{ text: "دورات", callback_data: "courses" }],
                    [{ text: "نوط", callback_data: "medallions" }],
                ],
            }
        });
    } else if (selectedValue === "lectures" || selectedValue === "courses" || selectedValue === "medallions") {
        userChoises[chatId].service = selectedValue;
        const data = await getCustomSubjects(`/subjects/all-custom-subjects?year=${userChoises[chatId].year}&season=${userChoises[chatId].season}`);
        if (data.length === 0) {
            bot.sendMessage(chatId, "عذراً لا يوجد مواد حالياً");
        } else {
            const subjects = data.map((subject) => [{ text: subject.name, callback_data: subject._id }]);
            bot.sendMessage(chatId, "الرجاء اختيار المادة", {
                reply_markup: {
                    inline_keyboard: subjects,
                }
            });
        }
    }
    else {
        // getAllFiles(`${BASE_API_URL}/all-courses`)
        // userChoises[chatId].fileId = selectedValue;
        // processUserChoices(chatId, userChoises[chatId]);
    }
});

/* End Handle Telegram Bot Events */