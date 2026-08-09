const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const noteController = require("../controllers/noteController");

router.get("/", authMiddleware, noteController.getNotes);

router.post("/", authMiddleware, noteController.addNote);

router.put("/:id", authMiddleware, noteController.updateNote);

router.delete("/:id", authMiddleware, noteController.deleteNote);

module.exports = router;