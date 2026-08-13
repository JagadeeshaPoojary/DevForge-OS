const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../models/projectModel");

// ============================================================
// GET PROJECTS
// ============================================================

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await getProjects(userId);

    res.json(projects);
  } catch (err) {
    console.error("Get projects error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// CREATE PROJECT
// ============================================================

exports.addProject = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const project = await createProject(
      userId,
      title.trim(),
      description?.trim() || ""
    );

    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// UPDATE PROJECT
// ============================================================

exports.updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const allowedStatuses = [
      "active",
      "completed",
      "archived",
    ];

    const normalizedStatus = String(
      status || "active"
    )
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid project status",
      });
    }

    const project = await updateProject(
      id,
      userId,
      title.trim(),
      description?.trim() || "",
      normalizedStatus
    );

    // Project does not exist OR belongs to another user
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// DELETE PROJECT
// ============================================================

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project = await deleteProject(
      id,
      userId
    );

    // Project does not exist OR belongs to another user
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete project error:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};