const db = require("../config/db");

// ============================================================
// GET ALL EVENTS FOR USER
// ============================================================

const getEvents = async (userId) => {
    const result = await db.query(
        `SELECT *
         FROM events
         WHERE user_id = $1
         ORDER BY event_date ASC`,
        [userId]
    );

    return result.rows;
};

// ============================================================
// CREATE EVENT
// ============================================================

const createEvent = async (
    userId,
    title,
    description,
    eventDate,
    eventType
) => {
    const result = await db.query(
        `INSERT INTO events (
            user_id,
            title,
            event_date,
            created_at,
            description,
            event_type
        )
        VALUES ($1, $2, $3, NOW(), $4, $5)
        RETURNING *`,
        [
            userId,
            title,
            eventDate,
            description || "",
            eventType || "meeting",
        ]
    );

    return result.rows[0];
};

// ============================================================
// UPDATE EVENT
// IMPORTANT: user_id is checked for ownership
// ============================================================

const updateEvent = async (
    id,
    userId,
    title,
    description,
    eventDate,
    eventType
) => {
    const result = await db.query(
        `UPDATE events
         SET
            title = $1,
            event_date = $2,
            description = $3,
            event_type = $4
         WHERE id = $5
           AND user_id = $6
         RETURNING *`,
        [
            title,
            eventDate,
            description || "",
            eventType || "meeting",
            id,
            userId,
        ]
    );

    return result.rows[0] || null;
};

// ============================================================
// DELETE EVENT
// IMPORTANT: user_id is checked for ownership
// ============================================================

const deleteEvent = async (id, userId) => {
    const result = await db.query(
        `DELETE FROM events
         WHERE id = $1
           AND user_id = $2
         RETURNING id`,
        [id, userId]
    );

    return result.rows[0] || null;
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};