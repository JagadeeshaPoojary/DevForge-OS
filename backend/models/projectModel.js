const db = require("../config/db");

// Get all projects for a user
const getProjects = async (userId) => {
    const result = await db.query(
        `SELECT * FROM projects
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

// Create a new project
const createProject = async (userId, title, description) => {
    const result = await db.query(
        `INSERT INTO projects(user_id, title, description)
         VALUES($1, $2, $3)
         RETURNING *`,
        [userId, title, description]
    );

    return result.rows[0];
};

// Update a project
const updateProject = async (id, title, description, status) => {
    const result = await db.query(
        `UPDATE projects
         SET title = $1,
             description = $2,
             status = $3
         WHERE id = $4
         RETURNING *`,
        [title, description, status, id]
    );

    return result.rows[0];
};

// Delete a project
const deleteProject = async (id) => {
    await db.query(
        "DELETE FROM projects WHERE id = $1",
        [id]
    );
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};