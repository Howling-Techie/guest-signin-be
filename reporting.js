const db = require("./database/connection");
const nodemailer = require("nodemailer");
const {isSameDay, format, eachDayOfInterval, addDays, previousMonday, startOfMonth} = require("date-fns");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateDailyUserReport = (guest, sessions) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>` + styleHtml + `<title>Daily Report - ${format(new Date(), "dd MMMM yyyy")}</title></head>
<body>
<div class="container">
    <h1>Daily Report - ${format(new Date(), "dd MMMM yyyy")}</h1>
    <p>Hi! Here is the daily report for ${guest.name}.</p>
    <div class="guest-info">
        <h3>Guest Info</h3>
        <h4>${guest.name}</h4>
        <p><strong>From:</strong> ${guest.source}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
    </div>
` + generateDailyTable(sessions) + "</div></body></html>";

    sendEmailReport(`Daily report for ${guest.name} - ${format(new Date(), "dd MMMM yyyy")}`, html, "fakeemail@domain.com");
};

const generateDailyReport = (sessions) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>` + styleHtml + `<title>Daily Report - ${format(new Date(), "dd MMMM yyyy")}</title></head>
<body>
<div class="container">
    <h1>Daily Report - ${format(new Date(), "dd MMMM yyyy")}</h1>
    <p>Hi! Here is the daily report.</p>
` + generateDailyTable(sessions) + "</div></body></html>";

    sendEmailReport(`Daily report for ${format(new Date(), "dd MMMM yyyy")}`, html, "fakeemail@domain.com");
};
const generateWeeklyUserReport = (guest, sessions) => {
    const startOfWeek = previousMonday(new Date());
    const html = `<!DOCTYPE html>
<html lang="en">
<head>` + styleHtml + `<title>Weekly Report - ${format(startOfWeek, "dd MMMM yyyy")}</title></head>
<body>
<div class="container">
    <h1>Weekly Report - ${format(new Date(), "MMMM yyyy")}</h1>
    <p>Hi! Here is the weekly report for ${guest.name}.</p>
    <div class="guest-info">
        <h3>Guest Info</h3>
        <h4>${guest.name}</h4>
        <p><strong>From:</strong> ${guest.source}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
    </div>
` + generateWeeklyTable(startOfWeek, sessions) + "</div></body></html>";

    sendEmailReport(`Monthly report for ${guest.name} - ${format(startOfWeek, "MMMM yyyy")}`, html, "fakeemail@domain.com");
};
const generateWeeklyReport = (sessions) => {
    const startOfWeek = previousMonday(new Date());
    const html = `<!DOCTYPE html>
<html lang="en">
<head>` + styleHtml + `<title>Weekly Report - ${format(startOfWeek, "dd MMMM yyyy")}</title></head>
<body>
<div class="container">
    <h1>Weekly Report - ${format(new Date(), "MMMM yyyy")}</h1>
    <p>Hi! Here is the weekly report.</p>
` + generateWeeklyTable(startOfWeek, sessions) + "</div></body></html>";

    sendEmailReport(`Monthly report for ${format(startOfWeek, "MMMM yyyy")}`, html, "fakeemail@domain.com");
};

const generateMonthlyUserReport = (guest, sessions) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>` + styleHtml + `<title>Monthly Report - ${format(new Date(), "MMMM yyyy")}</title></head>
<body>
<div class="container">
    <h1>Monthly Report - ${format(new Date(), "MMMM yyyy")}</h1>
    <p>Hi! Here is the monthly report for ${guest.name}.</p>
    <div class="guest-info">
        <h3>Guest Info</h3>
        <h4>${guest.name}</h4>
        <p><strong>From:</strong> ${guest.source}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
    </div>
` + generateCalendar(startOfMonth(new Date()), sessions) + generateMonthlyTable(sessions) + "</div></body></html>";

    sendEmailReport(`Monthly report for ${guest.name} - ${format(new Date(), "MMMM yyyy")}`, html, "fakeemail@domain.com");
};

const sendEmailReport = (subject, content, recipient) => {
    transporter.sendMail({
        from: "stanley.daniel@ethereal.email",
        to: recipient,
        subject: subject,
        html: content
    });
};

const generateCalendar = (date, sessions) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const headerHtml = `
<div>
<h2>Calendar for ${monthNames[date.getMonth()]} ${date.getFullYear()}</h2>
    <table class="cal" style="table-layout: fixed">
        <thead>
        <tr style="height: fit-content">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
        </thead>
        <tbody>
            <tr>`;

    const blankCellCount = startOfMonth.getDay();
    let firstRowHtml = Array(blankCellCount).fill("<td></td>").join("");
    for (let i = 1; i <= 7 - blankCellCount; i++) {
        const todaysEvents = sessions.filter(s => isSameDay(new Date(s.checkIn), new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i)));
        const todaysEventsHtml = todaysEvents.map(e => `<div class="visit-info">${format(new Date(e.checkIn), "hh:mm aa")}<br>${format(new Date(e.checkOut), "hh:mm aa")}</div>`).join("");
        firstRowHtml += `<td ${todaysEvents.length > 0 ? "class=\"present\"" : ""}>` + i + todaysEventsHtml + "</td>";
    }
    firstRowHtml += "</tr>";

    const offset = 8 - blankCellCount;
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let remainingRowsHtml = "";
    for (let i = offset; i <= daysInMonth; i++) {
        const todaysEvents = sessions.filter(s => isSameDay(new Date(s.checkIn), new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i)));

        if ((new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i)).getDay() === 0) {
            remainingRowsHtml += "<tr>";
        }
        const todaysEventsHtml = todaysEvents.map(e => `<div class="visit-info">${format(new Date(e.checkIn), "hh:mm aa")}<br>${format(new Date(e.checkOut), "hh:mm aa")}</div>`).join("");
        remainingRowsHtml += `<td ${todaysEvents.length > 0 ? "class=\"present\"" : ""}>` + i + todaysEventsHtml + "</td>";
        if ((new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), i)).getDay() === 6) {
            remainingRowsHtml += "</tr>";
        }
    }

    let restOfFinalRowHtml = Array(6 - (new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), daysInMonth)).getDay()).fill("<td></td>").join("") + "</tr>";
    const endOfTableHtml = `</tbody>
</table>
</div>`;
    return headerHtml + firstRowHtml + remainingRowsHtml + restOfFinalRowHtml + endOfTableHtml;
};

const generateMonthlyTable = (sessions) => {
    const generateTableRows = (sessions) => {
        let rows = "";
        sessions.forEach(session => {
            rows += `
            <tr>
                <td>${format(new Date(session.checkIn), "EEEE do LLLL")}</td>
                <td>${format(new Date(session.checkIn), "hh:mm aa")}</td>
                <td>${format(new Date(session.checkOut), "hh:mm aa")}</td>
                <td>${session.reason}</td>
            </tr>
<tr><td colspan="4"><strong>Feedback:</strong> ${session.feedback}</td> </tr>`;
        });
        return rows;
    };

    const tableRows = generateTableRows(sessions);
    return `
<div>
<h2>Visits Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Reason</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
</div>`;
};

const generateDailyTable = (sessions) => {
    const generateTableRows = (sessions) => {
        let rows = "";
        sessions.forEach(session => {
            rows += `
            <tr>
                <td>${session.guest.name}</td>
                <td>${format(new Date(session.checkIn), "hh:mm aa")}</td>
                <td>${format(new Date(session.checkOut), "hh:mm aa")}</td>
                <td>${session.guest.source}</td>
                <td>${session.reason}</td>
            </tr>
<tr><td colspan="5"><strong>Feedback:</strong> ${session.feedback}</td> </tr>`;
        });
        return rows;
    };
    const tableRows = generateTableRows(sessions);
    return `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>From</th>
                    <th>Reason</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>`;
};

const generateWeeklyTable = (startDate, sessions) => {
    const days = eachDayOfInterval({start: startDate, end: addDays(startDate, 6)});
    const daysHtml = [];
    for (const day of days) {
        const dayTableHtml = generateDailyTable(sessions.filter(s => isSameDay(s.checkIn, day)));
        daysHtml.push(`<h2>${format(day, "EEEE")}</h2>
${dayTableHtml}`);
    }
    return daysHtml;
};

const styleHtml = `    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        h1 {
            background-color: #4e5d94;
            color: whitesmoke;
            text-align: center;
            text-transform: uppercase;
            font-weight: bold;
            padding: 10px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #4e5d94;
            color: #fff;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .guest-info {
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 5px 20px;
            width: fit-content;
        }

        .cal tr {
            height: 80px;
            vertical-align: top;
        }

        .cal td:nth-last-child(1) {
            background-color: darkgray;
        }

        .cal td:nth-child(1) {
            background-color: darkgray;
        }

        strong {
            color: #4e5d94;
        }

        .present {
            background-color: #b0e0e6; /* Light blue */
            width: fit-content;
        }

        .visit-info {
            background-color: #f0f0f0; /* Light grey */
            margin-top: 5px;
            border-radius: 5px;
            padding: 5px;
            font-size: 12px;
            line-height: 1.2;
            white-space: nowrap;
            z-index: 1;
            width: fit-content;
            align-content: center;
        }
    </style>`;

module.exports = {
    generateDailyUserReport,
    generateDailyReport,
    generateWeeklyUserReport,
    generateWeeklyReport,
    generateMonthlyUserReport
};
