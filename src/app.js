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
const allowedOrigins = [
    "http://192.168.1.111:3000",
    "http://192.168.1.37:3000",
    "*",
    "https://your-production-site.com",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow request
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required when sending cookies or auth headers
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