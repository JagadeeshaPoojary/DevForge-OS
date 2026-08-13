const db = require("../config/db");

// ============================================================
// GET ALL PROJECTS FOR A USER
// ============================================================

const getProjects = async (userId) => {
  const result = await db.query(
    `SELECT *
     FROM projects
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

// ============================================================
// CREATE PROJECT
// ============================================================

const createProject = async (userId, title, description) => {
  const result = await db.query(
    `INSERT INTO projects (
       user_id,
       title,
       description,
       status
     )
     VALUES ($1, $2, $3, 'active')
     RETURNING *`,
    [userId, title, description]
  );

  return result.rows[0];
};

// ============================================================
// UPDATE PROJECT
// IMPORTANT: user_id is checked for ownership
// ============================================================

const updateProject = async (
  id,
  userId,
  title,
  description,
  status
) => {
  const result = await db.query(
    `UPDATE projects
     SET
       title = $1,
       description = $2,
       status = $3
     WHERE id = $4
       AND user_id = $5
     RETURNING *`,
    [
      title,
      description,
      status,
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
};

// ============================================================
// DELETE PROJECT
// IMPORTANT: user_id is checked for ownership
// ============================================================

const deleteProject = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM projects
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
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};