const {Router} = require("express");
const {
    getActiveSessions,
    getDailySessions,
    getWeeklySessions,
    postSessionStart,
    postSessionEnd
} = require("../controllers/sessions.controller");
const sessionsRouter = Router();

sessionsRouter
    .route("/today")
    .get(getDailySessions)
sessionsRouter
    .route("/week")
    .get(getWeeklySessions)

sessionsRouter
    .route("/active")
    .get(getActiveSessions)

sessionsRouter
    .route("/signin/")
    .post(postSessionStart)

sessionsRouter
    .route("/signout/:sessionId")
    .post(postSessionEnd)

module.exports = sessionsRouter;