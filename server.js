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