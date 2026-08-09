const {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} = require("../models/plannerModel");

exports.getTasks = async (req, res) => {

    try {

        const tasks = await getAllTasks();

        res.json(tasks);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

exports.addTask = async (req, res) => {

    try {

        const { task, task_date } = req.body;

        const planner = await createTask(
            req.user.id,
            task,
            task_date
        );

        res.status(201).json(planner);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

exports.updateTask = async (req, res) => {

    try {

        const { task, task_date, status } = req.body;

        const planner = await updateTask(
            req.params.id,
            task,
            task_date,
            status
        );

        res.json(planner);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

exports.deleteTask = async (req, res) => {

    try {

        await deleteTask(req.params.id);

        res.json({
            success: true,
            message: "Task Deleted Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};