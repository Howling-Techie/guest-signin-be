const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cron = require("node-cron");
require("dotenv").config();

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const {selectDailySessions, selectWeeklySessions, selectMonthlySessions} = require("./models/sessions.model");
const {
    generateDailyUserReport,
    generateDailyReport,
    generateWeeklyUserReport,
    generateWeeklyReport, generateMonthlyUserReport
} = require("./reporting");
const app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Function for generating reports
async function generateDailyReports() {
    const sessions = await selectDailySessions();
    const guestIds = [...new Set(sessions.map(session => session.guest.id))];
    const guests = guestIds.map(id => sessions.find(s => s.guest.id === id).guest);
    for (const guest of guests) {
        generateDailyUserReport(guest, sessions.filter(s => s.guest.id === guest.id));
    }
    generateDailyReport(sessions);
}

async function generateWeeklyReports() {
    const sessions = await selectWeeklySessions();
    const guestIds = [...new Set(sessions.map(session => session.guest.id))];
    const guests = guestIds.map(id => sessions.find(s => s.guest.id === id).guest);
    for (const guest of guests) {
        generateWeeklyUserReport(guest, sessions.filter(s => s.guest.id === guest.id));
    }
    generateWeeklyReport(sessions);
}

async function generateMonthlyReports() {
    const sessions = await selectMonthlySessions();
    console.log(sessions);
    const guestIds = [...new Set(sessions.map(session => session.guest.id))];
    const guests = guestIds.map(id => sessions.find(s => s.guest.id === id).guest);
    for (const guest of guests) {
        generateMonthlyUserReport(guest, sessions.filter(s => s.guest.id === guest.id));
    }
}

// Schedule tasks to be run on the server.
// For generating daily reports at 5PM
cron.schedule("* 17 * * *", function () {
    generateDailyReports();
});

// For generating weekly reports at 5PM every Friday
cron.schedule("* 17 * * 5", function () {
    generateWeeklyReports();
});

// For generating monthly reports at 5PM on the last day of the month
cron.schedule("* 17 L * *", function () {
    generateMonthlyReports();
});

module.exports = app;
