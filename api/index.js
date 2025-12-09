const express = require("express");
const apiRouter = require("../src/api");

const app = express();
app.use(apiRouter);

module.exports = app;
