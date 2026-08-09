const {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} = require("../models/projectModel");

exports.getProjects = async (req, res) => {
    try {
        const projects = await getProjects(req.user.id);
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addProject = async (req, res) => {
    try {

        const { title, description } = req.body;

        const project = await createProject(
            req.user.id,
            title,
            description
        );

        res.status(201).json(project);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const project = await updateProject(id, title, description, status);
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteProject(id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};