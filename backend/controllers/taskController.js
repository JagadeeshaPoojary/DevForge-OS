const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require("../models/taskModel");

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await getTasks(req.user.id);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Create task
exports.addTask = async (req, res) => {
    try {
        const {
            project_id,
            title,
            description,
            priority,
            status,
            due_date
        } = req.body;

        const task = await createTask(
            req.user.id,
            project_id,
            title,
            description,
            priority,
            status,
            due_date
        );

        res.status(201).json(task);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            due_date
        } = req.body;

        const task = await updateTask(
            req.params.id,
            title,
            description,
            priority,
            status,
            due_date
        );

        res.json(task);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        await deleteTask(req.params.id);

        res.json({
            message: "Task deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};