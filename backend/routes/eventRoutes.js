const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

router.get("/", authMiddleware, eventController.getEvents);

router.post("/", authMiddleware, eventController.addEvent);

router.put("/:id", authMiddleware, eventController.updateEvent);

router.delete("/:id", authMiddleware, eventController.deleteEvent);

module.exports = router;