const noteModel = require("../models/noteModel");

// ============================================================
// GET NOTES
// ============================================================

exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await noteModel.getNotes(userId);

    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// CREATE NOTE
// ============================================================

exports.addNote = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Note title is required",
      });
    }

    const note = await noteModel.createNote(
      userId,
      title.trim(),
      content?.trim() || ""
    );

    res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// UPDATE NOTE
// ============================================================

exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Note title is required",
      });
    }

    const note = await noteModel.updateNote(
      id,
      userId,
      title.trim(),
      content?.trim() || ""
    );

    // Not found OR belongs to another user
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (err) {
    console.error("Update note error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// DELETE NOTE
// ============================================================

exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const note = await noteModel.deleteNote(
      id,
      userId
    );

    // Not found OR belongs to another user
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.error("Delete note error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};