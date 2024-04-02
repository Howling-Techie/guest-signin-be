const {
    selectGuests,
    insertGuest,
    selectGuest,
    insertGuestSession,
    updateGuestSession
} = require("../models/guests.model");
const getGuests = (req, res, next) => {
    selectGuests(req.query)
        .then((guests) => {
            res.status(200).send({guests});
        })
        .catch((error) => {
            next(error);
        });
};

const createGuest = (req, res, next) => {
    insertGuest(req.body)
        .then((guest) => {
            res.status(201).send({guest});
        })
        .catch((error) => {
            next(error);
        });
};

const getGuest = (req, res, next) => {
    selectGuest(req.params)
        .then((guest) => {
            res.status(200).send({guest});
        })
        .catch((error) => {
            next(error);
        });
};

const signGuestIn = (req, res, next) => {
    insertGuestSession(req.params, req.body)
        .then((guest) => {
            res.status(200).send({guest});
        })
        .catch((error) => {
            next(error);
        });
};

const signGuestOut = (req, res, next) => {
    updateGuestSession(req.params, req.body)
        .then((guest) => {
            res.status(200).send({guest});
        })
        .catch((error) => {
            next(error);
        });
};

module.exports = {
    signGuestIn,
    signGuestOut,
    createGuest,
    getGuest,
    getGuests
};