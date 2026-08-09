const { getUserById } = require("../models/userModel");
const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    console.log("JWT user:", req.user);

    const userId = req.user.id;

    console.log("Looking for user ID:", userId);

    const user = await getUserById(userId);

    console.log("Database user:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    const result = await db.query(
      `
        UPDATE users
        SET full_name = $1
        WHERE id = $2
        RETURNING id, full_name, email, created_at
      `,
      [full_name.trim(), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};