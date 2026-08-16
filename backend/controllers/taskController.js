const {
  getTasks,
  verifyProjectOwnership,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/taskModel");

// ============================================================
// GET TASKS
// ============================================================

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await getTasks(userId);

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.error("=================================");
    console.error("GET TASKS ERROR");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Detail:", err.detail);
    console.error("Hint:", err.hint);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: "Unable to load tasks",
      error: process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
    });
  }
};

// ============================================================
// CREATE TASK
// ============================================================

exports.addTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      project_id,
      title,
      description,
      priority,
      status,
      due_date,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // ----------------------------------------------------------
    // Validate project ownership
    // ----------------------------------------------------------

    if (project_id) {
      const ownsProject = await verifyProjectOwnership(
        project_id,
        userId
      );

      if (!ownsProject) {
        return res.status(403).json({
          message: "You cannot assign a task to this project",
        });
      }
    }

    // ----------------------------------------------------------
    // Validate priority
    // ----------------------------------------------------------

    const allowedPriorities = [
      "low",
      "medium",
      "high",
    ];

    const normalizedPriority = String(
      priority || "medium"
    )
      .trim()
      .toLowerCase();

    if (!allowedPriorities.includes(normalizedPriority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    // ----------------------------------------------------------
    // Validate status
    // ----------------------------------------------------------

    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    const normalizedStatus = String(
      status || "pending"
    )
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // ----------------------------------------------------------
    // Create task
    // ----------------------------------------------------------

    const task = await createTask(
      userId,
      project_id || null,
      title.trim(),
      description?.trim() || "",
      normalizedPriority,
      normalizedStatus,
      due_date || null
    );

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// UPDATE TASK
// ============================================================

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const {
      project_id,
      title,
      description,
      priority,
      status,
      due_date,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // ----------------------------------------------------------
    // Validate project ownership
    // ----------------------------------------------------------

    if (project_id) {
      const ownsProject = await verifyProjectOwnership(
        project_id,
        userId
      );

      if (!ownsProject) {
        return res.status(403).json({
          message: "You cannot assign a task to this project",
        });
      }
    }

    // ----------------------------------------------------------
    // Validate priority
    // ----------------------------------------------------------

    const allowedPriorities = [
      "low",
      "medium",
      "high",
    ];

    const normalizedPriority = String(
      priority || "medium"
    )
      .trim()
      .toLowerCase();

    if (!allowedPriorities.includes(normalizedPriority)) {
      return res.status(400).json({
        message: "Invalid task priority",
      });
    }

    // ----------------------------------------------------------
    // Validate status
    // ----------------------------------------------------------

    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    const normalizedStatus = String(
      status || "pending"
    )
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // ----------------------------------------------------------
    // Update task
    // ----------------------------------------------------------

    const task = await updateTask(
      id,
      userId,
      title.trim(),
      description?.trim() || "",
      normalizedPriority,
      normalizedStatus,
      due_date || null,
      project_id || null
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// DELETE TASK
// ============================================================

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id } = req.params;

    const task = await deleteTask(
      id,
      userId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("Delete task error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};