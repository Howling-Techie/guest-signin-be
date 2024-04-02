const db = require("../database/connection");

const selectActiveSessions = async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const data = await db.query(`SELECT *
                                 FROM sessions
                                 WHERE checkIn >= ?
                                   AND checkOut is NULL`, [startOfDay.toISOString()]);

    for (const datum of data) {
        datum.guest = (await db.query(`SELECT id, name, source
                                       FROM guests
                                       WHERE id = ?`, [datum.guestId]))[0];
    }
    return data;
};
const selectDailySessions = async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const data = await db.query(`SELECT *
                                 FROM sessions
                                 WHERE checkIn >= ?
                                   AND checkIn < ?`, [startOfDay.toISOString(), endOfDay.toISOString()]);
    for (const datum of data) {
        datum.guest = (await db.query(`SELECT id, name, source
                                       FROM guests
                                       WHERE id = ?`, [datum.guestId]))[0];
    }
    return data;
};

const selectWeeklySessions = async () => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
    const data = await db.query(`SELECT *
                                 FROM sessions
                                 WHERE checkIn >= ?
                                   AND checkIn < ?`, [startOfWeek.toISOString(), endOfWeek.toISOString()]);
    for (const datum of data) {
        datum.guest = (await db.query(`SELECT id, name, source
                                       FROM guests
                                       WHERE id = ?`, [datum.id]))[0];
    }
    return data;
};
const insertSessionStart = async (body) => {
    const {guest, checkInTime, reason} = body;
    return await db.query(`INSERT INTO sessions (guestId, checkIn, reason)
                           VALUES (?, ?, ?)
                           RETURNING *`, [guest, checkInTime, reason]);
};
const updateSessionEnd = async (params, body) => {
    if (!Object.hasOwn(params, "sessionId")) {
        return Promise.reject("Missing session id");
    }
    const {sessionId} = params;
    const {satisfied = "", feedback = ""} = body;
    const data = await db.query(`UPDATE sessions
                                 SET checkOut  = ?,
                                     satisfied = ?,
                                     feedback  = ?
                                 WHERE id = ?
                                 RETURNING *`, [(new Date()).toISOString(), satisfied, feedback, sessionId]);
    return data[0];
};

module.exports = {
    insertSessionStart,
    updateSessionEnd,
    selectWeeklySessions,
    selectDailySessions,
    selectActiveSessions
};