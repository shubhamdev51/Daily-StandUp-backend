const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/middleware");
const { submitMorning, submitEvening } = require("../controllers/standupController");
const { getUsers } = require("../controllers/adminController");
const { getUserMorReport } = require("../controllers/adminController");
const { getUserEveReport } = require("../controllers/adminController");

router.post("/morning", protect, submitMorning);
router.post("/evening", protect, submitEvening);
router.get("/reportedEmails", protect, getUsers);
router.get("/morningReport", protect, getUserMorReport);
router.get("/eveningReport", protect, getUserEveReport);

module.exports = router;