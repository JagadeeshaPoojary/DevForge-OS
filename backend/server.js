const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const plannerRoutes = require("./routes/plannerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const app = express();
const taskRoutes = require("./routes/taskRoutes");
const noteRoutes = require("./routes/noteRoutes");
const eventRoutes = require("./routes/eventRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);


// ===============================
// PROFILE
// ===============================

// Get current user profile
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, full_name, email, created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// Update current user profile
app.put("/api/profile", authMiddleware, async (req, res) => {
  try {
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
      [full_name.trim(), req.user.id]
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
});

app.get("/", (req, res) => {
    res.send("🚀 DevForge OS Backend Running");
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevForge OS backend running on port ${PORT}`);
});
