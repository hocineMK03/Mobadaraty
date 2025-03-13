const express = require("express");

const router = express.Router();
const checkInControllers=require("../../controllers/checkInControllers");

router.get("/scan/:volunteerID/:associationID", checkInControllers.handleScanQR);


module.exports = router;
