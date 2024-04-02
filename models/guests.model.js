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

const selectGuest = async (params) => {
    const {guestId} = params;
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

module.exports = {
    selectGuests,
    selectGuest,
    insertGuest
};