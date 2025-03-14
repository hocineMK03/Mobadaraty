const express = require("express");

const router = express.Router();

const invitationControllers = require("../../controllers/invitationControllers");
const verifyToken = require("../../middlewares/verifyToken");
const verifyAssociation = require("../../middlewares/verifyAssociation");


router.post("/sendinvite",verifyToken,verifyAssociation, invitationControllers.sendInvite);


module.exports = router;
