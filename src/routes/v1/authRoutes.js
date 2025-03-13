const express = require("express");

const router = express.Router();

const multer = require("multer");

const authcontrollers = require("../../controllers/authControllers");

const verifySpecialToken = require("../../middlewares/verifySpecialToken");

// Use multer's memoryStorage instead of diskStorage to keep files in memory (RAM)
const storage = multer.memoryStorage(); // In-memory storage
const upload = multer({ storage: storage });

router.post("/login", authcontrollers.handleLogin);
// In your routes file
router.post("/association/register", upload.single("legalDocuments"), async (req, res, next) => {
  const start = Date.now();
  try {
    await authcontrollers.handleAssociationRegister(req, res, next); // Pass next to the controller
    console.log(`Request took ${Date.now() - start} ms`);
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});


router.post("/volunteer/register", verifySpecialToken, authcontrollers.handleVolunteernRegister);

module.exports = router;
