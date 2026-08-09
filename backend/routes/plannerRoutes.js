const express = require("express");

const router = express.Router();

const plannerController = require("../controllers/plannerController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, plannerController.getTasks);

router.post("/", authMiddleware, plannerController.addTask);

router.put("/:id", authMiddleware, plannerController.updateTask);

router.delete("/:id", authMiddleware, plannerController.deleteTask);
module.exports = router;