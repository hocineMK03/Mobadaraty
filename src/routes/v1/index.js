const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const invitationRoutes = require("./invitationRoutes");

router.use("/auth", authRoutes);
router.use("/invitation", invitationRoutes);
module.exports = router;
