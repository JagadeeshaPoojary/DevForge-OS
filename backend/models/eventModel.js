const db = require("../config/db");

// Get all events for a user
const getEvents = async (userId) => {
    const result = await db.query(
        `
        SELECT *
        FROM events
        WHERE user_id = $1
        ORDER BY event_date ASC
        `,
        [userId]
    );

    return result.rows;
};

// Create a new event
const createEvent = async (userId, title, description, eventDate) => {
    const result = await db.query(
        `
        INSERT INTO events (
            user_id,
            title,
            event_date,
            created_at,
            description
        )
        VALUES ($1, $2, $3, NOW(), $4)
        RETURNING *
        `,
        [
            userId,
            title,
            eventDate,
            description
        ]
    );

    return result.rows[0];
};

// Update an event
const updateEvent = async (id, title, description, eventDate) => {
    const result = await db.query(
        `
        UPDATE events
        SET
            title = $1,
            event_date = $2,
            description = $3
        WHERE id = $4
        RETURNING *
        `,
        [
            title,
            eventDate,
            description,
            id
        ]
    );

    return result.rows[0];
};

// Delete an event
const deleteEvent = async (id) => {
    await db.query(
        "DELETE FROM events WHERE id = $1",
        [id]
    );
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};