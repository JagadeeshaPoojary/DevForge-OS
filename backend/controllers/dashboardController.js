const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await db.query(
      "SELECT COUNT(*) FROM projects WHERE user_id=$1",
      [userId]
    );

    const tasks = await db.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id=$1",
      [userId]
    );

    const notes = await db.query(
      "SELECT COUNT(*) FROM notes WHERE user_id=$1",
      [userId]
    );

    const events = await db.query(
      "SELECT COUNT(*) FROM events WHERE user_id=$1",
      [userId]
    );

    res.json({
      projects: Number(projects.rows[0].count),
      tasks: Number(tasks.rows[0].count),
      notes: Number(notes.rows[0].count),
      events: Number(events.rows[0].count),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};