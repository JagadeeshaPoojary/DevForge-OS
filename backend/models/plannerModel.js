const db = require("../config/db");

// Get all planner tasks
const getAllTasks = async () => {
    const result = await db.query(
        "SELECT * FROM planner ORDER BY id DESC"
    );
    return result.rows;
};

// Add planner task
const createTask = async (user_id, task, task_date) => {
    const result = await db.query(
        `INSERT INTO planner(user_id, task, task_date)
         VALUES($1,$2,$3)
         RETURNING *`,
        [user_id, task, task_date]
    );

    return result.rows[0];
};

// Update planner task
const updateTask = async (id, task, task_date, status) => {
    const result = await db.query(
        `UPDATE planner
         SET task=$1,
             task_date=$2,
             status=$3
         WHERE id=$4
         RETURNING *`,
        [task, task_date, status, id]
    );

    return result.rows[0];
};

// Delete planner task
const deleteTask = async (id) => {
    await db.query(
        "DELETE FROM planner WHERE id=$1",
        [id]
    );
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
};

module.exports = {
    getAllTasks,
    createTask
};