const express = require("express");

const router = express.Router();

const taskControllers=require("../../controllers/taskControllers");
const verifyToken = require("../../middlewares/verifyToken");
const verifyAssociation = require("../../middlewares/verifyAssociation");


router.post("/create",verifyToken,verifyAssociation,taskControllers.createTask);
router.put("/update")
router.delete("/delete")
router.get("/location/:locationId")
router.post("/assign",verifyToken,verifyAssociation,taskControllers.assignTask);
router.post("/unassign")
module.exports = router;
