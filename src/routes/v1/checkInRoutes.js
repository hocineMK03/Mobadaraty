const express = require("express");

const router = express.Router();
const checkInControllers=require("../../controllers/checkInControllers");

const verifyToken = require("../../middlewares/verifyToken");
const verifyAssociation = require("../../middlewares/verifyAssociation");


router.get("/scan/:volunteerID/:associationID",verifyToken,verifyAssociation, checkInControllers.handleScanQR);


module.exports = router;
