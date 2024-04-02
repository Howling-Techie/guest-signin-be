const {Router} = require("express");
const {createGuest, getGuest, getGuests, signGuestIn, signGuestOut} = require("../controllers/guests.controller");

const guestsRouter = Router();

guestsRouter
    .route("/")
    .get(getGuests)
    .post(createGuest);

guestsRouter
    .route("/:guestId")
    .get(getGuest);

guestsRouter
    .route("/:guestId/signin")
    .post(signGuestIn);

guestsRouter
    .route("/:guestId/signout")
    .post(signGuestOut);

module.exports = guestsRouter;