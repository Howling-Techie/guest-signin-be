const apiRouter = require("express").Router();
const guestsRouter = require("./guests.router");
const sessionsRouter = require("./sessions.router");

apiRouter.use("/guests", guestsRouter);
apiRouter.use("/sessions", sessionsRouter);
module.exports = apiRouter;
