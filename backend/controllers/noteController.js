const noteModel = require("../models/noteModel");

// Get all notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.getNotes(req.user.id);
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Create note
exports.addNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = await noteModel.createNote(
            req.user.id,
            title,
            content
        );

        res.status(201).json(note);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update note
exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = await noteModel.updateNote(
            req.params.id,
            title,
            content
        );

        res.json(note);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete note
exports.deleteNote = async (req, res) => {
    try {
        await noteModel.deleteNote(req.params.id);

        res.json({
            message: "Note deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};