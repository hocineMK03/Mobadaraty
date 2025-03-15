const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");
const volunteerControllers=require("../../controllers/volunteerControllers")

router.post("/acceptinvite",volunteerControllers.handleAcceptInvite)


router.post("/createinvites",volunteerControllers.handleCreateInvites)

router.get("/getinvites",verifyToken,volunteerControllers.handleGetInvites)
module.exports = router;
