const express = require("express");

const router = express.Router();

const multer = require("multer");

const authcontrollers = require("../../controllers/authControllers");

const verifySpecialToken = require("../../middlewares/verifySpecialToken");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/login", authcontrollers.handleLogin);

router.post(
  "/association/register",
  upload.single("legalDocuments"),
  authcontrollers.handleAssociationRegister
);
router.post("/volunteer/register",verifySpecialToken, authcontrollers.handleVolunteernRegister);
module.exports = router;
