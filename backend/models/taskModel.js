const db = require("../config/db");

// ============================================================
// GET ALL TASKS FOR USER
// ============================================================

const getTasks = async (userId) => {
  const result = await db.query(
    `SELECT
       id,
       project_id,
       title,
       description,
       priority,
       status,
       due_date,
       created_at,
       user_id
     FROM tasks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

// ============================================================
// CHECK PROJECT OWNERSHIP
// ============================================================

const verifyProjectOwnership = async (projectId, userId) => {
  if (!projectId) {
    return true;
  }

  const result = await db.query(
    `SELECT id
     FROM projects
     WHERE id = $1
       AND user_id = $2`,
    [projectId, userId]
  );

  return result.rows.length > 0;
};

// ============================================================
// CREATE TASK
// ============================================================

const createTask = async (
  userId,
  projectId,
  title,
  description,
  priority,
  status,
  dueDate
) => {
  const result = await db.query(
    `INSERT INTO tasks (
       user_id,
       project_id,
       title,
       description,
       priority,
       status,
       due_date
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      userId,
      projectId || null,
      title,
      description || "",
      priority || "medium",
      status || "pending",
      dueDate || null,
    ]
  );

  return result.rows[0];
};

// ============================================================
// UPDATE TASK
// ============================================================

const updateTask = async (
  id,
  userId,
  title,
  description,
  priority,
  status,
  dueDate,
  projectId
) => {
  const result = await db.query(
    `UPDATE tasks
     SET
       title = $1,
       description = $2,
       priority = $3,
       status = $4,
       due_date = $5,
       project_id = $6
     WHERE id = $7
       AND user_id = $8
     RETURNING *`,
    [
      title,
      description || "",
      priority || "medium",
      status || "pending",
      dueDate || null,
      projectId || null,
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
};

// ============================================================
// DELETE TASK
// ============================================================

const deleteTask = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM tasks
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
  getTasks,
  verifyProjectOwnership,
  createTask,
  updateTask,
  deleteTask,
};