const express = require("express");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");

const errorController = require("./controllers/errorController");
const router = require("./routes");
const cors = require("cors");

const app = express();

const sequelize = new Sequelize(
  "postgres://postgres.vrkqqfpvkdpbsmsbajjt:5oio1ff7e8fLQKwn@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  {
    dialectModule: require("pg"),
  }
);

// Using middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

app.use(router);

app.use(errorController.onLost);
app.use(errorController.onError);

module.exports = app;
