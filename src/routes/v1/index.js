const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const invitationRoutes = require("./invitationRoutes");
const donationRoutes = require("./donationRoutes");
router.use("/auth", authRoutes);
router.use("/invitation", invitationRoutes);
router.use("/donation", donationRoutes);
module.exports = router;
