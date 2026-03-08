const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/middleware");
const { submitMorning, submitEvening } = require("../controllers/standupController");

router.post("/morning", protect, submitMorning);
router.post("/evening", protect, submitEvening);

module.exports = router;