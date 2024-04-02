const {
    selectActiveSessions,
    selectDailySessions,
    selectWeeklySessions,
    updateSessionEnd, insertSessionStart
} = require("../models/sessions.model");

const getActiveSessions = (req, res, next) => {
    selectActiveSessions()
        .then((sessions) => {
            res.status(200).send({sessions});
        })
        .catch((error) => {
            next(error);
        });
};
const getDailySessions = (req, res, next) => {
    selectDailySessions()
        .then((sessions) => {
            res.status(200).send({sessions});
        })
        .catch((error) => {
            next(error);
        });
};
const getWeeklySessions = (req, res, next) => {
    selectWeeklySessions()
        .then((sessions) => {
            res.status(200).send({sessions});
        })
        .catch((error) => {
            next(error);
        });
};

const postSessionEnd = (req, res, next) => {
    updateSessionEnd(req.body)
        .then((session) => {
            res.status(201).send({session});
        })
        .catch((error) => {
            next(error);
        });
};

const postSessionStart = (req, res, next) => {
    insertSessionStart(req.body)
        .then((session) => {
            res.status(201).send({session});
        })
        .catch((error) => {
            next(error);
        });
};

// const getSessions = (req, res, next) => {
//     selectSessions(req.query)
//         .then((sessions) => {
//             res.status(200).send({sessions});
//         })
//         .catch((error) => {
//             next(error);
//         });
// };

module.exports = {
    getWeeklySessions,
    getDailySessions,
    getActiveSessions,
    postSessionStart,
    postSessionEnd
}