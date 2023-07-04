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

/* End Config The Server */

/* Start Running The Server */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`The Server Is Running On: http://localhost:${PORT}`));

/* End Running The Server */

/* Start Handle The Routes */

const adminRouter = require("./routes/admin.router"),
    medallionsRouter = require("./routes/medallion.router"),
    coursesRouter = require("./routes/courses.router"),
    lecturesRouter = require("./routes/lectures.router"),
    subjectsRouter = require("./routes/subjects.router");

app.use("/admin", adminRouter);

app.use("/medallions", medallionsRouter);

app.use("/courses", coursesRouter);

app.use("/lectures", lecturesRouter);

app.use("/subjects", subjectsRouter);

/* End Handle The Routes */

/* Start Bot Initialize */

const token = "6208009889:AAHn2kqO2IS2ojG-dYpNpOBcOCp1pWgvAXo";

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });

const { handleStartBot, handleCallBackQuery } = require("./telegram-bot/functions");

bot.onText(/\/start/, (msg) => handleStartBot(bot, msg));

bot.on("callback_query", (query) => handleCallBackQuery(bot, query));

/* End Bot Initialize */

module.exports = bot;