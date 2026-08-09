import { useEffect, useState } from "react";
import {
  Search,
  Command,
  Menu,
  FolderKanban,
  CheckSquare,
  FileText,
  CalendarDays,
} from "lucide-react";

import ProfileMenu from "../Profile/ProfileMenu";
import NotificationCenter from "../Notifications/NotificationCenter";
import useProfile from "../../hooks/useProfile";
import api from "../../services/api";

export default function Header({ onMenuClick }) {
  const { user, loading } = useProfile();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      const query = search.trim().toLowerCase();

      if (!query) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);

      try {
        const [projectsRes, tasksRes, notesRes, eventsRes] =
          await Promise.all([
            api.get("/projects"),
            api.get("/tasks"),
            api.get("/notes"),
            api.get("/events"),
          ]);

        const projects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : [];

        const tasks = Array.isArray(tasksRes.data)
          ? tasksRes.data
          : tasksRes.data.tasks || [];

        const notes = Array.isArray(notesRes.data)
          ? notesRes.data
          : notesRes.data.notes || [];

        const events = Array.isArray(eventsRes.data)
          ? eventsRes.data
          : eventsRes.data.events || [];

        const matchedResults = [
          ...projects
            .filter(
              (project) =>
                project.title?.toLowerCase().includes(query) ||
                project.description?.toLowerCase().includes(query)
            )
            .map((project) => ({
              id: `project-${project.id}`,
              type: "Project",
              title: project.title,
              description: project.description,
              icon: FolderKanban,
              color: "text-violet-400",
            })),

          ...tasks
            .filter(
              (task) =>
                task.title?.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query)
            )
            .map((task) => ({
              id: `task-${task.id}`,
              type: "Task",
              title: task.title,
              description: task.description,
              icon: CheckSquare,
              color: "text-blue-400",
            })),

          ...notes
            .filter(
              (note) =>
                note.title?.toLowerCase().includes(query) ||
                note.content?.toLowerCase().includes(query)
            )
            .map((note) => ({
              id: `note-${note.id}`,
              type: "Note",
              title: note.title || "Untitled Note",
              description: note.content,
              icon: FileText,
              color: "text-pink-400",
            })),

          ...events
            .filter(
              (event) =>
                event.title?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query)
            )
            .map((event) => ({
              id: `event-${event.id}`,
              type: "Event",
              title: event.title,
              description: event.description,
              icon: CalendarDays,
              color: "text-emerald-400",
            })),
        ];

        setResults(matchedResults.slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setShowResults(true);
      } finally {
        setSearching(false);
      }
    };

    const timer = setTimeout(searchData, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <header className="flex items-center justify-between gap-4">

      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            border border-white/10
            bg-white/5
            text-slate-400
            transition
            hover:bg-white/10
            hover:text-white
            lg:hidden
          "
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden w-full max-w-[420px] md:block">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (search.trim()) {
                setShowResults(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearch("");
                setShowResults(false);
              }
            }}
            placeholder="Search anything..."
            className="
              h-11
              w-full
              rounded-2xl
              border
              border-white/10
              bg-white/[0.04]
              pl-11
              pr-20
              text-sm
              text-white
              outline-none
              placeholder:text-slate-600
              transition
              focus:border-violet-500/40
              focus:bg-white/[0.06]
            "
          />

          {/* Shortcut */}
          {!search && (
            <div
              className="
                absolute
                right-3
                top-1/2
                flex
                -translate-y-1/2
                items-center
                gap-1
                rounded-lg
                border
                border-white/10
                bg-white/5
                px-2
                py-1
                text-xs
                text-slate-500
              "
            >
              <Command size={12} />
              K
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div
              className="
                absolute
                left-0
                right-0
                top-14
                z-50
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#0b1020]/95
                shadow-2xl
                shadow-black/40
                backdrop-blur-2xl
              "
            >

              {searching ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <Search
                    size={22}
                    className="mx-auto mb-2 text-slate-600"
                  />

                  <p className="text-sm text-slate-400">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Try another search term.
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto p-2">

                  {results.map((result) => {
                    const Icon = result.icon;

                    return (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setSearch(result.title);
                          setShowResults(false);
                        }}
                        className="
                          flex
                          w-full
                          items-start
                          gap-3
                          rounded-xl
                          p-3
                          text-left
                          transition
                          hover:bg-white/5
                        "
                      >

                        <div className="rounded-lg bg-white/5 p-2">
                          <Icon
                            size={17}
                            className={result.color}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center gap-2">

                            <p className="truncate text-sm font-medium text-white">
                              {result.title}
                            </p>

                            <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
                              {result.type}
                            </span>

                          </div>

                          {result.description && (
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {result.description}
                            </p>
                          )}

                        </div>

                      </button>
                    );
                  })}

                </div>
              )}

            </div>
          )}

        </div>

        {/* Mobile Title */}
        <div className="md:hidden">
          <p className="text-sm font-semibold text-white">
            DevForge OS
          </p>

          <p className="text-[10px] text-slate-500">
            Workspace
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Notification */}
        <NotificationCenter />

        {/* Profile */}
        <ProfileMenu
          user={user}
          loading={loading}
        />

      </div>

    </header>
  );
}