import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Search,
  Grid2X2,
  List,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "active",
  });

  const normalizeStatus = (status) => {
    return String(status || "active")
      .trim()
      .toLowerCase();
  };

  // -----------------------------
  // Load projects
  // -----------------------------
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.projects || [];

      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial project loading is intentionally triggered from this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  // -----------------------------
  // Form
  // -----------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingProject(null);

    setForm({
      title: "",
      description: "",
      status: "active",
    });

    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);

    setForm({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "active",
    });

    setShowForm(true);
  };

  // -----------------------------
  // Save
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
        });

        toast.success("Project updated successfully.");
      } else {
        await api.post("/projects", {
          title: form.title.trim(),
          description: form.description.trim(),
        });

        toast.success("Project created successfully.");
      }

      setShowForm(false);
      setEditingProject(null);

      await fetchProjects();
    } catch (error) {
      console.error("Project save error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      setProjects((current) =>
        current.filter((project) => project.id !== id)
      );

      toast.success("Project deleted.");
    } catch (error) {
      console.error("Delete project error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    }
  };

  // -----------------------------
  // Filtering
  // -----------------------------
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const projectStatus = normalizeStatus(project.status);

      const matchesFilter =
        filter === "all" ||
        projectStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  // -----------------------------
  // Statistics
  // -----------------------------
  const activeCount = projects.filter(
    (project) => normalizeStatus(project.status) === "active"
  ).length;

  const completedCount = projects.filter(
    (project) => normalizeStatus(project.status) === "completed"
  ).length;

 

  // -----------------------------
  // Status styling
  // -----------------------------
  const getStatus = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          className:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };

      case "archived":
        return {
          label: "Archived",
          className:
            "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: Archive,
        };

      default:
        return {
          label: "Active",
          className:
            "bg-violet-500/10 text-violet-400 border-violet-500/20",
          icon: Clock3,
        };
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060916] px-4 py-6 text-white sm:px-6 lg:px-8">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 shadow-lg shadow-violet-950/30">
              <FolderKanban
                size={26}
                className="text-violet-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Projects
              </h1>

              <p className="mt-1 text-sm text-slate-400 sm:text-base">
                Manage your projects and track progress.
              </p>
            </div>

          </div>

          <button
            onClick={openCreateForm}
            className="
              flex items-center justify-center gap-2
              rounded-2xl
              bg-gradient-to-r from-violet-600 to-blue-600
              px-5 py-3
              font-semibold
              text-white
              shadow-lg shadow-violet-950/30
              transition
              hover:-translate-y-0.5
              hover:from-violet-500
              hover:to-blue-500
            "
          >
            <Plus size={19} />
            New Project
          </button>

        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Total Projects
              </p>

              <FolderKanban
                size={19}
                className="text-violet-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Active
              </p>

              <Clock3
                size={19}
                className="text-blue-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Completed
              </p>

              <CheckCircle2
                size={19}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold">
              {completedCount}
            </p>
          </div>

        </div>

        {/* Toolbar */}
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
              placeholder="Search projects..."
              className="
                w-full
                rounded-2xl
                border border-white/10
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
                border border-white/10
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
                All Projects
              </option>

              <option value="active">
                Active
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="archived">
                Archived
              </option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-2xl border border-white/10 bg-white/[0.035] p-1">

              <button
                onClick={() => setViewMode("grid")}
                className={`
                  rounded-xl p-2.5 transition
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
                onClick={() => setViewMode("list")}
                className={`
                  rounded-xl p-2.5 transition
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

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <Loader2
              size={34}
              className="animate-spin text-violet-400"
            />
          </div>
        ) : filteredProjects.length === 0 ? (

          /* Empty */
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-16 text-center backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
              <FolderKanban
                size={30}
                className="text-violet-400"
              />
            </div>

            <h2 className="text-xl font-semibold">
              {search || filter !== "all"
                ? "No matching projects"
                : "No projects yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "Create your first project to get started."}
            </p>

            {!search && filter === "all" && (
              <button
                onClick={openCreateForm}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium transition hover:bg-violet-500"
              >
                Create Project
              </button>
            )}

          </div>

        ) : viewMode === "grid" ? (

          /* Grid */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => {
              const status = getStatus(
                project.status
              );

              const StatusIcon = status.icon;

              return (
                <div
                  key={project.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.035]
                    p-5
                    shadow-2xl shadow-black/10
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-500/30
                    hover:bg-white/[0.055]
                  "
                >

                  {/* Card glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition group-hover:bg-violet-500/20" />

                  <div className="relative">

                    {/* Top */}
                    <div className="mb-5 flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                        <FolderKanban
                          size={21}
                          className="text-violet-400"
                        />
                      </div>

                      <div className="flex gap-1">

                        <button
                          onClick={() =>
                            openEditForm(project)
                          }
                          className="rounded-xl p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(project.id)
                          }
                          className="rounded-xl p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>

                    {/* Title */}
                    <h2 className="truncate text-lg font-semibold">
                      {project.title}
                    </h2>

                    <p className="mt-2 min-h-[44px] line-clamp-2 text-sm leading-6 text-slate-500">
                      {project.description ||
                        "No description provided."}
                    </p>

                    {/* Progress */}
                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Progress
                        </span>

                        <span className="text-violet-400">
                          {project.status === "completed"
                            ? "100%"
                            : project.status === "archived"
                            ? "100%"
                            : "In progress"}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`
                            h-full rounded-full
                            ${
                              project.status ===
                              "completed"
                                ? "w-full bg-emerald-400"
                                : "w-2/5 bg-gradient-to-r from-violet-500 to-blue-500"
                            }
                          `}
                        />
                      </div>

                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

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
                          ${status.className}
                        `}
                      >
                        <StatusIcon size={13} />
                        {status.label}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={13} />
                        Project
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* List */
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur-xl">

            {filteredProjects.map((project, index) => {
              const status = getStatus(
                project.status
              );

              const StatusIcon = status.icon;

              return (
                <div
                  key={project.id}
                  className={`
                    flex flex-col gap-4 p-5
                    transition hover:bg-white/[0.035]
                    lg:flex-row lg:items-center
                    ${
                      index !==
                      filteredProjects.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }
                  `}
                >

                  <div className="flex min-w-0 flex-1 items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                      <FolderKanban
                        size={20}
                        className="text-violet-400"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {project.title}
                      </h3>

                      <p className="truncate text-sm text-slate-500">
                        {project.description ||
                          "No description provided."}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`
                      inline-flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-3 py-1
                      text-xs
                      font-medium
                      ${status.className}
                    `}
                  >
                    <StatusIcon size={13} />
                    {status.label}
                  </span>

                  <div className="flex items-center gap-1">

                    <button
                      onClick={() =>
                        openEditForm(project)
                      }
                      className="rounded-xl p-2 text-slate-500 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(project.id)
                      }
                      className="rounded-xl p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">

          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-6 shadow-2xl shadow-black/50">

            {/* Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="relative">

              {/* Header */}
              <div className="mb-6 flex items-start justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    {editingProject
                      ? "Edit Project"
                      : "Create Project"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingProject
                      ? "Update your project details."
                      : "Add a new project to your workspace."}
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="text-sm text-slate-400">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. DevForge OS"
                    autoFocus
                    className="
                      mt-2
                      w-full
                      rounded-xl
                      border border-white/10
                      bg-white/[0.04]
                      px-4 py-3
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-violet-500/50
                      focus:ring-2
                      focus:ring-violet-500/20
                    "
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your project..."
                    rows={4}
                    className="
                      mt-2
                      w-full
                      resize-none
                      rounded-xl
                      border border-white/10
                      bg-white/[0.04]
                      px-4 py-3
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      focus:border-violet-500/50
                      focus:ring-2
                      focus:ring-violet-500/20
                    "
                  />
                </div>

                {editingProject && (
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
                        border border-white/10
                        bg-[#151a2b]
                        px-4 py-3
                        text-white
                        outline-none
                        focus:border-violet-500/50
                      "
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="archived">
                        Archived
                      </option>
                    </select>
                  </div>
                )}

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
                    to-blue-600
                    px-4 py-3
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-violet-950/30
                    transition
                    hover:from-violet-500
                    hover:to-blue-500
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
                      {editingProject
                        ? "Update Project"
                        : "Create Project"}
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