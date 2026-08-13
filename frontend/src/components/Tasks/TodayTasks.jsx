import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

export default function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/tasks");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.tasks || [];

      setTasks(data.slice(0, 5));
    } catch (err) {
      console.error("FAILED TO LOAD TASKS");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);

      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Toggle task completion
  const toggleTask = async (task) => {
    if (updatingId === task.id) return;

    try {
      setUpdatingId(task.id);

      const completed =
        task.status?.toLowerCase() === "completed";

      const newStatus = completed ? "Pending" : "Completed";

      const response = await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description || "",
        priority: task.priority || "Medium",
        status: newStatus,
        due_date: task.due_date || null,
      });

      const updatedTask = response.data;

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id
            ? updatedTask
            : item
        )
      );
    } catch (err) {
      console.error("FAILED TO UPDATE TASK");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-red-500/20 bg-red-500/10 text-red-300";

      case "medium":
        return "border-amber-500/20 bg-amber-500/10 text-amber-300";

      case "low":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

      default:
        return "border-white/10 bg-white/5 text-slate-400";
    }
  };

  const isCompleted = (task) => {
    return (
      task.completed === true ||
      task.status?.toLowerCase() === "completed"
    );
  };

  return (
    <div
      className="
        h-full
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <ClipboardList
                size={20}
                className="text-blue-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Today's Tasks
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Your latest tasks and priorities
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-3
            py-2
            text-sm
            font-semibold
            text-violet-300
          "
        >
          {tasks.length}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="
                rounded-2xl
                border
                border-white/5
                bg-white/[0.03]
                p-4
              "
            >
              <div className="h-5 w-full animate-pulse rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-10 text-center">
          <RefreshCw
            size={28}
            className="mx-auto mb-4 text-red-400"
          />

          <p className="font-medium text-red-400">
            Unable to load tasks
          </p>

          <button
            onClick={fetchTasks}
            className="
              mt-4
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2
              text-sm
              text-slate-300
              hover:bg-white/10
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && tasks.length === 0 && (
        <div className="py-10 text-center">
          <ClipboardList
            size={32}
            className="mx-auto mb-3 text-slate-600"
          />

          <p className="text-slate-400">
            No tasks yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create a task to see it here.
          </p>
        </div>
      )}

      {/* Task List */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => {
            const completed = isCompleted(task);
            const updating = updatingId === task.id;

            return (
              <div
                key={task.id}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-4
                  transition-all
                  duration-300
                  hover:border-violet-500/20
                  hover:bg-white/[0.06]
                "
              >
                {/* CLICKABLE CHECKBOX */}
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  disabled={updating}
                  aria-label={
                    completed
                      ? "Mark task as pending"
                      : "Mark task as completed"
                  }
                  className="
                    shrink-0
                    rounded-full
                    p-1
                    transition-all
                    duration-200
                    hover:bg-white/10
                    disabled:cursor-wait
                  "
                >
                  {completed ? (
                    <CheckCircle2
                      size={22}
                      className="
                        text-emerald-400
                        drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]
                      "
                    />
                  ) : (
                    <Circle
                      size={22}
                      className="
                        text-slate-500
                        transition-colors
                        group-hover:text-violet-400
                      "
                    />
                  )}
                </button>

                {/* Task Information */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-medium ${
                      completed
                        ? "text-slate-500 line-through"
                        : "text-white"
                    }`}
                  >
                    {task.title || "Untitled Task"}
                  </p>

                  {task.description && (
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Priority */}
                {task.priority && (
                  <span
                    className={`
                      shrink-0
                      rounded-lg
                      border
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      ${getPriorityStyle(task.priority)}
                    `}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}