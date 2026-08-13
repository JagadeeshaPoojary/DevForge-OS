import { useEffect, useState } from "react";
import {
  FolderKanban,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import Skeleton from "../UI/Skeleton";

export default function RecentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get("/projects");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.projects || [];

      setProjects(data.slice(0, 5));
    } catch (err) {
      console.error("FAILED TO LOAD PROJECTS");
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);
      console.error("Message:", err.message);

      setError(true);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

      case "in progress":
      case "in_progress":
        return "border-blue-500/20 bg-blue-500/10 text-blue-300";

      case "pending":
        return "border-amber-500/20 bg-amber-500/10 text-amber-300";

      default:
        return "border-white/10 bg-white/5 text-slate-400";
    }
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
        transition-all
        duration-300
        hover:border-white/15
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5">
              <FolderKanban
                size={20}
                className="text-violet-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Recent Projects
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Your latest projects
          </p>
        </div>

        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
          <FolderKanban
            size={20}
            className="text-violet-400"
          />
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
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="py-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <RefreshCw
              size={24}
              className="text-red-400"
            />
          </div>

          <p className="font-medium text-red-400">
            Unable to load projects
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please check your connection and try again.
          </p>

          <button
            onClick={fetchProjects}
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
              transition
              hover:bg-white/10
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && projects.length === 0 && (
        <div className="py-10 text-center">
          <FolderKanban
            size={36}
            className="mx-auto mb-3 text-slate-600"
          />

          <p className="text-slate-400">
            No projects yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create a project to see it here.
          </p>
        </div>
      )}

      {/* Projects */}
      {!loading && !error && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="
                group
                rounded-2xl
                border
                border-white/5
                bg-white/[0.03]
                p-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-violet-500/20
                hover:bg-white/[0.06]
                hover:shadow-lg
                hover:shadow-violet-950/20
              "
            >
              <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="shrink-0 rounded-xl bg-violet-500/10 p-2">
                  <FolderKanban
                    size={18}
                    className="text-violet-400"
                  />
                </div>

                {/* Project information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-white transition-colors group-hover:text-violet-300">
                      {project.title || "Untitled Project"}
                    </h3>

                    <ArrowUpRight
                      size={15}
                      className="
                        shrink-0
                        text-slate-600
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:text-violet-400
                        group-hover:opacity-100
                      "
                    />
                  </div>

                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                {project.status && (
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
                      ${getStatusStyle(project.status)}
                    `}
                  >
                    {project.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}