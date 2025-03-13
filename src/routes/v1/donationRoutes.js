const express = require("express");

const router = express.Router();


const donationController=require("../../controllers/donationControllers")

const verifyToken = require("../../middlewares/verifyToken");

router.post("/create",verifyToken,donationController.handleCreateDonation)

router.post("/payment",verifyToken,donationController.handleProcessPayment)



router.get("/assossiation/:assossiationID")

router.get("/user",verifyToken,donationController.handleGetDonationByUserId)



module.exports = router;
