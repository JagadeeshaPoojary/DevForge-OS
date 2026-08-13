const eventModel = require("../models/eventModel");

// ============================================================
// GET EVENTS
// ============================================================

exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await eventModel.getEvents(userId);

    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// CREATE EVENT
// ============================================================

exports.addEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      event_date,
      event_type,
    } = req.body;

    if (!title || !title.trim() || !event_date) {
      return res.status(400).json({
        message: "Title and event date are required",
      });
    }

    const allowedTypes = [
      "meeting",
      "project",
      "task",
      "call",
    ];

    const normalizedType = String(
      event_type || "meeting"
    )
      .trim()
      .toLowerCase();

    if (!allowedTypes.includes(normalizedType)) {
      return res.status(400).json({
        message: "Invalid event type",
      });
    }

    const event = await eventModel.createEvent(
      userId,
      title.trim(),
      description?.trim() || "",
      event_date,
      normalizedType
    );

    res.status(201).json(event);
  } catch (err) {
    console.error("Create event error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// UPDATE EVENT
// ============================================================

exports.updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const {
      title,
      description,
      event_date,
      event_type,
    } = req.body;

    if (!title || !title.trim() || !event_date) {
      return res.status(400).json({
        message: "Title and event date are required",
      });
    }

    const allowedTypes = [
      "meeting",
      "project",
      "task",
      "call",
    ];

    const normalizedType = String(
      event_type || "meeting"
    )
      .trim()
      .toLowerCase();

    if (!allowedTypes.includes(normalizedType)) {
      return res.status(400).json({
        message: "Invalid event type",
      });
    }

    const event = await eventModel.updateEvent(
      id,
      userId,
      title.trim(),
      description?.trim() || "",
      event_date,
      normalizedType
    );

    // Not found OR belongs to another user
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (err) {
    console.error("Update event error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// DELETE EVENT
// ============================================================

exports.deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const event = await eventModel.deleteEvent(
      id,
      userId
    );

    // Not found OR belongs to another user
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("Delete event error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};