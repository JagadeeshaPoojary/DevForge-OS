const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");

router.get("/", authMiddleware, projectController.getProjects);

router.post("/", authMiddleware, projectController.addProject);

router.put("/:id", authMiddleware, projectController.updateProject);

router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;