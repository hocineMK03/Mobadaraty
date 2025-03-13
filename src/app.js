const express = require("express");
const { connectDB } = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const v1Routes = require("./routes/v1");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
app.use(express.json());
// CORS setup first
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors()); // Enable pre-flight for all routes

// Body parsers next

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Route middleware
app.use("/api/v1", v1Routes);

// Connect to database
connectDB();

// Error handler should be last
app.use(errorHandler);

module.exports = app;