const db = require("../config/db");

const createUser = async (full_name, email, password) => {
  const query = `
    INSERT INTO users(full_name, email, password)
    VALUES($1, $2, $3)
    RETURNING id, full_name, email;
  `;

  const values = [full_name, email, password];

  const result = await db.query(query, values);

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query(
    `
      SELECT id, full_name, email, created_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};