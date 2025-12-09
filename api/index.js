const express = require("express");
const apiRouter = require("../src/api");

const app = express();
app.use("/api", apiRouter);

module.exports = app;
