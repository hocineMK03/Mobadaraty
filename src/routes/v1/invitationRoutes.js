const express = require("express");

const router = express.Router();

const invitationControllers = require("../../controllers/invitationControllers");
const verifyToken = require("../../middlewares/verifyToken");
router.post("/sendinvite",verifyToken, invitationControllers.sendInvite);


module.exports = router;
