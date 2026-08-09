const db = require("../config/db");

// Get all tasks for a user
const getTasks = async (userId) => {
    const result = await db.query(
        `SELECT * FROM tasks
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

// Create a new task
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
        `INSERT INTO tasks
        (user_id, project_id, title, description, priority, status, due_date)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
        [
            userId,
            projectId,
            title,
            description,
            priority,
            status,
            dueDate
        ]
    );

    return result.rows[0];
};

// Update a task
const updateTask = async (
    id,
    title,
    description,
    priority,
    status,
    dueDate
) => {

    const result = await db.query(
        `UPDATE tasks
        SET
            title = $1,
            description = $2,
            priority = $3,
            status = $4,
            due_date = $5
        WHERE id = $6
        RETURNING *`,
        [
            title,
            description,
            priority,
            status,
            dueDate,
            id
        ]
    );

    return result.rows[0];
};


// Delete a task
const deleteTask = async (id) => {
    await db.query(
        "DELETE FROM tasks WHERE id=$1",
        [id]
    );
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};