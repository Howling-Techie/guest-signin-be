const db = require("../database/connection");

const selectGuests = async (query) => {
    if (query && Object.hasOwn(query, "name")) {
        const {name} = query;
        const data = await db.query(`SELECT id, name, source
                                     FROM guests
                                     WHERE name like ?`, ["%" + name + "%"]);
        return data;
    } else {
        const data = await db.query(`SELECT id, name, source
                                     FROM guests`);
        return data;
    }
};

const insertGuest = async (body) => {
    if (!(Object.hasOwn(body, "name") && Object.hasOwn(body, "source") && Object.hasOwn(body, "email"))) {
        return Promise.reject("Missing properties");
    }
    const {name, source, email} = body;
    const data = await db.query(`INSERT INTO guests (name, source, email)
                                 VALUES (?, ?, ?)
                                 RETURNING *`, [name, source, email]);
    return data[0];
};

const selectGuest = async (query) => {
    const {guestId} = query;
    if (!guestId)
        return Promise.reject("Missing guest ID");

    const data = await db.query(`SELECT *
                                 FROM guests
                                 WHERE id = ?`, [guestId]);
    data.sessions = await db.query(`SELECT *
                                    FROM sessions
                                    WHERE guestId = ?`, [guestId]);
    return data;
};

const insertGuestSession = async (params, body) => {
    const {guestId} = params;
    const {guest, checkInTime, reason} = body;
    const data = await db.query(`INSERT INTO sessions (guestId, checkIn, reason)
                                 VALUES (?, ?, ?)
                                 RETURNING *`, [guest, checkInTime, reason]);
    return data;
};

const updateGuestSession = (params, body) => {
    const {guestId} = params;

    if (!guestId)
        return Promise.reject("Missing guest ID");
    if (!(Object.hasOwn(body, "checkOutTime") && Object.hasOwn(body, "satisfied") && Object.hasOwn(body, "feedback"))) {
        return Promise.reject("Missing properties");
    }

    const {checkOutTime, satisfied, feedback} = body;
    const data = db.query(`UPDATE sessions
                           SET checkOut  = ?,
                               satisfied = ?,
                               feedback  = ?
                           WHERE guestId = ?`, [checkOutTime, satisfied, feedback, guestId]);
    return data;
};

module.exports = {
    selectGuests,
    selectGuest,
    insertGuest,
    insertGuestSession,
    updateGuestSession
};