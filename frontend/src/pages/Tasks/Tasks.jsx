import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Grid2X2,
  List,
  CalendarDays,
  Flag,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const [form, setForm] = useState({
    project_id: "",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  });

  // =========================================================
  // FETCH TASKS
  // =========================================================

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.tasks || [];

      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);

      toast.error(
        error.response?.data?.message || "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.projects || [];

      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    // Initial task/project loading is intentionally triggered from this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();

    fetchProjects();
  }, []);
  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE FORM
  // =========================================================

  const openCreateForm = () => {
    setEditingTask(null);

    setForm({
      project_id: "",
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      due_date: "",
    });

    setShowForm(true);
  };

  // =========================================================
  // EDIT FORM
  // =========================================================

  const openEditForm = (task) => {
    setEditingTask(task);

    setForm({
      project_id: task.project_id || "",
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      due_date: task.due_date
        ? String(task.due_date).substring(0, 10)
        : "",
    });

    setShowForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingTask(null);
  };

  // =========================================================
  // SAVE TASK
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        project_id: form.project_id
          ? Number(form.project_id)
          : null,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || null,
      };

      if (editingTask) {
        await api.put(
          `/tasks/${editingTask.id}`,
          payload
        );

        toast.success("Task updated successfully.");
      } else {
        await api.post("/tasks", payload);

        toast.success("Task created successfully.");
      }

      closeForm();
      await fetchTasks();
    } catch (error) {
      console.error("Task save error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${id}`);

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );

      toast.success("Task deleted.");
    } catch (error) {
      console.error("Delete task error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    }
  };

  // =========================================================
  // TOGGLE TASK STATUS
  // =========================================================

  const toggleTaskStatus = async (task) => {
    const newStatus =
      task.status === "completed"
        ? "pending"
        : "completed";

    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description || "",
        priority: task.priority || "medium",
        status: newStatus,
        due_date: task.due_date || null,
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      toast.success(
        newStatus === "completed"
          ? "Task completed."
          : "Task reopened."
      );
    } catch (error) {
      console.error(
        "Task status update error:",
        error
      );

      toast.error("Unable to update task.");
    }
  };

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchText ||
        task.title
          ?.toLowerCase()
          .includes(searchText) ||
        task.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "all" ||
        task.status === filter ||
        task.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

 
  // =========================================================
  // PROJECT NAME
  // =========================================================

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    return project?.title || "No project";
  };

  // =========================================================
  // PRIORITY STYLE
  // =========================================================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      case "low":
        return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";

      default:
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    return "border-violet-500/20 bg-violet-500/10 text-violet-400";
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050816] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute right-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[150px]" />

        <div className="absolute bottom-[-150px] left-[35%] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute bottom-0 right-[20%] h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[130px]" />

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1500px]">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-950/30">

              <ListTodo
                size={27}
                className="text-blue-400"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tasks
              </h1>

              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage your tasks and track your progress.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-blue-600
              px-6
              py-3.5
              font-semibold
              shadow-[0_10px_40px_rgba(99,102,241,0.30)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_15px_50px_rgba(99,102,241,0.45)]
            "
          >
            <Plus size={19} />
            New Task
          </button>

        </div>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Total */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Total Tasks
              </p>

              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <ListTodo
                  size={19}
                  className="text-blue-400"
                />
              </div>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {tasks.length}
            </p>

          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Pending
              </p>

              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <Clock3
                  size={19}
                  className="text-violet-400"
                />
              </div>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {pendingCount}
            </p>

          </div>

          {/* Completed */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-400">
                Completed
              </p>

              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <CheckCircle2
                  size={19}
                  className="text-emerald-400"
                />
              </div>

            </div>

            <p className="mt-3 text-3xl font-bold">
              {completedCount}
            </p>

          </div>

        </div>

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.035]
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                backdrop-blur-xl
                placeholder:text-slate-600
                focus:border-violet-500/40
                focus:ring-2
                focus:ring-violet-500/10
              "
            />

          </div>

          <div className="flex items-center gap-3">

            {/* Filter */}

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="
                rounded-2xl
                border
                border-white/10
                bg-[#101527]
                px-4
                py-3
                text-sm
                text-slate-300
                outline-none
                focus:border-violet-500/40
              "
            >
              <option value="all">
                All Tasks
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="high">
                High Priority
              </option>

              <option value="medium">
                Medium Priority
              </option>

              <option value="low">
                Low Priority
              </option>
            </select>

            {/* View Switch */}

            <div className="flex rounded-2xl border border-white/10 bg-white/[0.035] p-1">

              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`
                  rounded-xl
                  p-2.5
                  transition
                  ${
                    viewMode === "grid"
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-slate-500 hover:text-white"
                  }
                `}
              >
                <Grid2X2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`
                  rounded-xl
                  p-2.5
                  transition
                  ${
                    viewMode === "list"
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-slate-500 hover:text-white"
                  }
                `}
              >
                <List size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center">

            <Loader2
              size={36}
              className="animate-spin text-violet-400"
            />

          </div>

        ) : filteredTasks.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-16 text-center backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

              <ListTodo
                size={30}
                className="text-blue-400"
              />

            </div>

            <h2 className="text-xl font-semibold">
              {search || filter !== "all"
                ? "No matching tasks"
                : "No tasks yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "Create your first task to get started."}
            </p>

            {!search && filter === "all" && (
              <button
                type="button"
                onClick={openCreateForm}
                className="
                  mt-6
                  rounded-xl
                  bg-violet-600
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition
                  hover:bg-violet-500
                "
              >
                Create Task
              </button>
            )}

          </div>

        ) : viewMode === "grid" ? (

          /* =================================================
             GRID VIEW
          ================================================= */

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredTasks.map((task) => {

              const completed =
                task.status === "completed";

              return (

                <div
                  key={task.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-5
                    shadow-2xl
                    shadow-black/10
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-500/30
                    hover:bg-white/[0.055]
                  "
                >

                  {/* Card Glow */}

                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

                  <div className="relative">

                    {/* Top */}

                    <div className="mb-5 flex items-start justify-between">

                      <button
                        type="button"
                        onClick={() =>
                          toggleTaskStatus(task)
                        }
                        className="transition hover:scale-105"
                        title={
                          completed
                            ? "Reopen task"
                            : "Complete task"
                        }
                      >
                        {completed ? (
                          <CheckCircle2
                            size={27}
                            className="text-emerald-400"
                          />
                        ) : (
                          <Circle
                            size={27}
                            className="text-slate-600 hover:text-violet-400"
                          />
                        )}
                      </button>

                      <div className="flex gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(task)
                          }
                          className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-white/10
                            hover:text-white
                          "
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(task.id)
                          }
                          className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-red-500/10
                            hover:text-red-400
                          "
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>

                    {/* Title */}

                    <h2
                      className={`
                        text-lg
                        font-semibold
                        ${
                          completed
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }
                      `}
                    >
                      {task.title}
                    </h2>

                    {/* Description */}

                    <p className="mt-2 min-h-[44px] line-clamp-2 text-sm leading-6 text-slate-500">
                      {task.description ||
                        "No description provided."}
                    </p>

                    {/* Project */}

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                      <ListTodo size={14} />

                      <span className="truncate">
                        {getProjectName(
                          task.project_id
                        )}
                      </span>

                    </div>

                    {/* Bottom */}

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">

                      {/* Priority */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${getPriorityStyle(
                            task.priority
                          )}
                        `}
                      >
                        <Flag size={12} />
                        {task.priority || "medium"}
                      </span>

                      {/* Status */}

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${getStatusStyle(
                            task.status
                          )}
                        `}
                      >
                        {completed ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock3 size={12} />
                        )}

                        {completed
                          ? "Completed"
                          : "Pending"}
                      </span>

                      {/* Date */}

                      {task.due_date && (
                        <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">

                          <CalendarDays size={13} />

                          {formatDate(
                            task.due_date
                          )}

                        </span>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* =================================================
             LIST VIEW
          ================================================= */

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl">

            {filteredTasks.map((task, index) => {

              const completed =
                task.status === "completed";

              return (

                <div
                  key={task.id}
                  className={`
                    flex
                    flex-col
                    gap-4
                    p-5
                    transition
                    hover:bg-white/[0.035]
                    lg:flex-row
                    lg:items-center
                    ${
                      index !==
                      filteredTasks.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }
                  `}
                >

                  {/* Complete */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleTaskStatus(task)
                    }
                    className="shrink-0"
                  >
                    {completed ? (
                      <CheckCircle2
                        size={25}
                        className="text-emerald-400"
                      />
                    ) : (
                      <Circle
                        size={25}
                        className="text-slate-600 hover:text-violet-400"
                      />
                    )}
                  </button>

                  {/* Content */}

                  <div className="min-w-0 flex-1">

                    <h3
                      className={`
                        truncate
                        font-semibold
                        ${
                          completed
                            ? "text-slate-500 line-through"
                            : "text-white"
                        }
                      `}
                    >
                      {task.title}
                    </h3>

                    <p className="truncate text-sm text-slate-500">
                      {task.description ||
                        "No description provided."}
                    </p>

                  </div>

                  {/* Project */}

                  <span className="text-sm text-slate-500">
                    {getProjectName(
                      task.project_id
                    )}
                  </span>

                  {/* Priority */}

                  <span
                    className={`
                      inline-flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${getPriorityStyle(
                        task.priority
                      )}
                    `}
                  >
                    <Flag size={12} />
                    {task.priority || "medium"}
                  </span>

                  {/* Status */}

                  <span
                    className={`
                      inline-flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${getStatusStyle(
                        task.status
                      )}
                    `}
                  >
                    {completed ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <Clock3 size={12} />
                    )}

                    {completed
                      ? "Completed"
                      : "Pending"}
                  </span>

                  {/* Date */}

                  {task.due_date && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">

                      <CalendarDays size={13} />

                      {formatDate(
                        task.due_date
                      )}

                    </span>
                  )}

                  {/* Actions */}

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(task)
                      }
                      className="
                        rounded-xl
                        p-2
                        text-slate-500
                        transition
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                      className="
                        rounded-xl
                        p-2
                        text-slate-500
                        transition
                        hover:bg-red-500/10
                        hover:text-red-400
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
          
          IMPORTANT:
          overflow-hidden removes the internal scrollbars.
      ===================================================== */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-md
          "
        >

          {/* MODAL */}

          <div
            className="
              relative
              w-full
              max-w-lg
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#0b1020]
              p-6
              shadow-2xl
              shadow-black/50
            "
          >

            {/* Modal Glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-600/15 blur-3xl" />

            <div className="relative">

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="mb-5 flex items-start justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    {editingTask
                      ? "Edit Task"
                      : "Create Task"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingTask
                      ? "Update your task details."
                      : "Add a new task to your workspace."}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="
                    rounded-xl
                    p-2
                    text-slate-500
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X size={20} />
                </button>

              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Task Title */}

                <div>

                  <label className="text-sm text-slate-400">
                    Task Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Complete DSA assignment"
                    autoFocus
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-violet-500/50
                      focus:ring-2
                      focus:ring-violet-500/20
                    "
                  />

                </div>

                {/* Description */}

                <div>

                  <label className="text-sm text-slate-400">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the task..."
                    rows={2}
                    className="
                      mt-2
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      px-4
                      py-3
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-violet-500/50
                      focus:ring-2
                      focus:ring-violet-500/20
                    "
                  />

                </div>

                {/* Project */}

                <div>

                  <label className="text-sm text-slate-400">
                    Project
                  </label>

                  <select
                    name="project_id"
                    value={form.project_id}
                    onChange={handleChange}
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-[#151a2b]
                      px-4
                      py-3
                      text-white
                      outline-none
                      focus:border-violet-500/50
                    "
                  >

                    <option value="">
                      No Project
                    </option>

                    {projects.map((project) => (

                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.title}
                      </option>

                    ))}

                  </select>

                </div>

                {/* Priority + Status */}

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label className="text-sm text-slate-400">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#151a2b]
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-violet-500/50
                      "
                    >

                      <option value="low">
                        Low
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="high">
                        High
                      </option>

                    </select>

                  </div>

                  <div>

                    <label className="text-sm text-slate-400">
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="
                        mt-2
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#151a2b]
                        px-4
                        py-3
                        text-white
                        outline-none
                        focus:border-violet-500/50
                      "
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                    </select>

                  </div>

                </div>

                {/* Due Date */}

                <div>

                  <label className="text-sm text-slate-400">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-[#151a2b]
                      px-4
                      py-3
                      text-white
                      outline-none
                      focus:border-violet-500/50
                    "
                  />

                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    via-purple-600
                    to-blue-600
                    px-4
                    py-3
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(99,102,241,0.25)]
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-[0_15px_40px_rgba(99,102,241,0.35)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />

                      {editingTask
                        ? "Update Task"
                        : "Create Task"}
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}