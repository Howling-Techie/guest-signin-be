const db = require("../database/connection");


const selectTodaysSessions = () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const data = db.query(`SELECT *
                           FROM sessions
                           WHERE checkIn >= ?
                             AND checkIn < ?`, [startOfDay, endOfDay]);
    return data;
};

const selectThisWeeksSessions = () => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
    const data = db.query(`SELECT *
                           FROM sessions
                           WHERE checkIn >= ?
                             AND checkIn < ?`, [startOfWeek, endOfWeek]);
    return data;
};

exports = {
    insertGuestSession,
    updateGuestSession,
    selectThisWeeksSessions,
    selectTodaysSessions
};