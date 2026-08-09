const db = require("../config/db");

const getDashboard = async (userId) => {
    const projects = await db.query(
        "SELECT COUNT(*) FROM projects WHERE user_id = $1",
        [userId]
    );

    const tasks = await db.query(
        "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
        [userId]
    );

    const notes = await db.query(
        "SELECT COUNT(*) FROM notes WHERE user_id = $1",
        [userId]
    );

    const events = await db.query(
        `SELECT id, title, event_date
         FROM events
         WHERE user_id = $1
         ORDER BY event_date ASC
         LIMIT 5`,
        [userId]
    );

    return {
        totalProjects: Number(projects.rows[0].count),
        totalTasks: Number(tasks.rows[0].count),
        totalNotes: Number(notes.rows[0].count),
        upcomingEvents: events.rows
    };
};

module.exports = {
    getDashboard
};