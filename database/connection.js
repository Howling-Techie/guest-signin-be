const sqlite = require("better-sqlite3");
const path = require("path");
const db = new sqlite(path.resolve("guests.db"), {fileMustExist: true});

function query(sql, params = []) {
    console.log(sql);
    console.log(params);
    return db.prepare(sql).all(params);
}

module.exports = {
    query
};