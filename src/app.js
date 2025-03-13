const express = require("express");

const { connectDB } = require("./config/db");

const app = express();

const errorHandler = require("./middlewares/errorHandler");

const v1Routes = require("./routes/v1");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", v1Routes);

connectDB();

app.use(errorHandler);

module.exports = app;
