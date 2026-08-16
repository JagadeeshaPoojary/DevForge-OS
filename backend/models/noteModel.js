const db = require("../config/db");

// ============================================================
// GET ALL NOTES FOR USER
// ============================================================

const getNotes = async (userId) => {
  const result = await db.query(
    `SELECT
       id,
       user_id,
       title,
       content,
       created_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

// ============================================================
// CREATE NOTE
// ============================================================

const createNote = async (
  userId,
  title,
  content
) => {
  const result = await db.query(
    `INSERT INTO notes (
       user_id,
       title,
       content
     )
     VALUES ($1, $2, $3)
     RETURNING *`,
    [
      userId,
      title,
      content || "",
    ]
  );

  return result.rows[0];
};

// ============================================================
// UPDATE NOTE
// ============================================================

const updateNote = async (
  id,
  userId,
  title,
  content
) => {
  const result = await db.query(
    `UPDATE notes
     SET
       title = $1,
       content = $2
     WHERE id = $3
       AND user_id = $4
     RETURNING *`,
    [
      title,
      content || "",
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
};

// ============================================================
// DELETE NOTE
// ============================================================

const deleteNote = async (
  id,
  userId
) => {
  const result = await db.query(
    `DELETE FROM notes
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};