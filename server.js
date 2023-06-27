/* Start Import And Create Express App */

const express = require("express");

const app = express();

/* End Import And Create Express App */

/* Start Config The Server */

const cors = require("cors"),
    bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());

/* Start direct the browser to statics files path */

const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

/* End direct the browser to statics files path */

const BASE_API_URL = require("./global/BASE_API_URL");

/* End Config The Server */

/* Start Running The Server */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`The Server Is Running On: http://localhost:${PORT}`));

/* End Running The Server */

/* Start Handle The Routes */

const adminRouter = require("./routes/admin.router"),
    medallionsRouter = require("./routes/medallion.router"),
    coursesRouter = require("./routes/courses.router"),
    lecturesRouter = require("./routes/lectures.router");

app.use("/admin", adminRouter);

app.use("/medallions", medallionsRouter);

app.use("/courses", coursesRouter);

app.use("/lectures", lecturesRouter);

/* End Handle The Routes */

/* Start Handle Telegram Bot Events */

const token = "6208009889:AAHn2kqO2IS2ojG-dYpNpOBcOCp1pWgvAXo";

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });

const channelId = "@Civil_Engineering_TU";

const channeURL = "https://t.me/Civil_Engineering_TU";

let userChoises = {};

const axios = require("axios");

async function getCustomFile(year, season, apiRoute, chatId) {
    const res = await axios.get(`${BASE_API_URL}${apiRoute}?year=${year}&season=${season}`);
    const data = await res.data;
    if (data.length === 0) {
        await bot.sendMessage(chatId, "عذراً لا توجد ملفات حالياً");
    } else {
        const fileUrl = `${BASE_API_URL}/${data[0].fileUrl}`;
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        await bot.sendDocument(chatId, response.data);
    }
}

async function processUserChoices(chatId, choises) {
    try {
        switch (choises.service) {
            case "medallion": {
                await getCustomFile(choises.year, choises.season, "/medallions/custom-medallion-file", chatId);
                break;
            }
            case "courses": {
                await getCustomFile(choises.year, choises.season, "/courses/custom-course-file", chatId);
                break;
            }
            case "lectures": {
                await getCustomFile(choises.year, choises.season, "/lectures/custom-lecture-file", chatId);
                break;
            }
            default: {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

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
        userChoises[chatId] = { year: null, season: null, service: null };
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
                    [{ text: "نوط", callback_data: "medallion" }],
                ],
            }
        });
    } else if (selectedValue === "medallion" || selectedValue === "courses" || selectedValue === "lectures") {
        userChoises[chatId].service = selectedValue;
        processUserChoices(chatId, userChoises[chatId]);
    }
});

/* End Handle Telegram Bot Events */