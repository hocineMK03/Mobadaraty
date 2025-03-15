const express = require("express");

const router = express.Router();


const volunteerControllers=require("../../controllers/volunteerControllers")

router.post("/acceptinvite",volunteerControllers.handleAcceptInvite)

module.exports = router;
