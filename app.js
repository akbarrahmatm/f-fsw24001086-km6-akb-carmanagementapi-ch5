require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const router = require("./routes");

const app = express();

// Using middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use(router);

module.exports = app;
