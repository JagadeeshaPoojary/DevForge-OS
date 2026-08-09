const eventModel = require("../models/eventModel");

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await eventModel.getEvents(req.user.id);
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Create event
exports.addEvent = async (req, res) => {
    try {
        const { title, description, event_date } = req.body;

        const event = await eventModel.createEvent(
            req.user.id,
            title,
            description,
            event_date
        );

        res.status(201).json(event);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, event_date } = req.body;

        const event = await eventModel.updateEvent(
            req.params.id,
            title,
            description,
            event_date
        );

        res.json(event);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        await eventModel.deleteEvent(req.params.id);

        res.json({
            message: "Event deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};