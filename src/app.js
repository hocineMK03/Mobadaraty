const express = require("express");
const { connectDB } = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const v1Routes = require("./routes/v1");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

// CORS setup first
app.use(cors());
app.options('*', cors()); // Enable pre-flight for all routes

// Body parsers next
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Route middleware
app.use("/api/v1", v1Routes);

// Connect to database
connectDB();

// Error handler should be last
app.use(errorHandler);

module.exports = app;