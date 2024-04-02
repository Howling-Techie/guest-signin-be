const {Router} = require("express");
const {
    createGuest,
    getGuest,
    getGuests
} = require("../controllers/guests.controller");

const guestsRouter = Router();

guestsRouter
    .route("/")
    .get(getGuests)
    .post(createGuest);

guestsRouter
    .route("/:guestId")
    .get(getGuest);

module.exports = guestsRouter;