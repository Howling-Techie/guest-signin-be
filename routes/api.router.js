const apiRouter = require("express").Router();
const guestsRouter = require("./guests.router");

apiRouter.use("/guests", guestsRouter);

module.exports = apiRouter;
