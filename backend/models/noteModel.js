const db = require("../config/db");

const getNotes = async (userId) => {
    const result = await db.query(
        "SELECT * FROM notes WHERE user_id=$1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows;
};

const createNote = async (userId, title, content) => {
    const result = await db.query(
        `INSERT INTO notes(user_id, title, content)
         VALUES($1,$2,$3)
         RETURNING *`,
        [userId, title, content]
    );
    return result.rows[0];
};

const updateNote = async (id, title, content) => {
    const result = await db.query(
        `UPDATE notes
         SET title=$1, content=$2
         WHERE id=$3
         RETURNING *`,
        [title, content, id]
    );
    return result.rows[0];
};

const deleteNote = async (id) => {
    await db.query("DELETE FROM notes WHERE id=$1", [id]);
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};