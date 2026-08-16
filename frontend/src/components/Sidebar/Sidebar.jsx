import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  StickyNote,
  CalendarDays,
  Settings,
  Code2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
const { pathname: currentPath } = useLocation();
const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    label: "Notes",
    icon: StickyNote,
    path: "/notes",
  },
  {
    label: "Calendar",
    icon: CalendarDays,
    path: "/calendar",
  },
];

const bottomItems = [
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar({ open, setOpen }) {
  const { user, loading } = useProfile();

  const fullName = user?.full_name || "User";
  const firstName = fullName.trim().split(" ")[0] || "User";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-72
        flex-col
        border-r
        border-white/10
        bg-[#070b17]/95
        px-4
        py-5
        backdrop-blur-2xl
        transition-transform
        duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20">
          <Code2 size={23} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight">
            DevForge
          </h1>

          <p className="text-xs text-slate-500">
            Developer OS
          </p>
        </div>
      </div>

      {/* Mobile close */}
      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 top-5 rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
      >
        ✕
      </button>

      {/* Workspace */}
      <div className="mb-4 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Workspace
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-3 rounded-2xl px-4 py-3
                transition-all duration-200
                ${
                  isActive
                    ? "bg-violet-500/15 text-white shadow-lg shadow-violet-950/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 h-7 w-1 rounded-r-full bg-gradient-to-b from-violet-400 to-blue-500" />
                  )}

                  <Icon
                    size={19}
                    className={
                      isActive
                        ? "text-violet-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }
                  />

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>

                  {isActive && (
                    <ChevronRight
                      size={15}
                      className="ml-auto text-violet-400"
                    />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Workspace */}
      <div className="mt-8">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Intelligence
        </p>

        <button className="group w-full rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10 p-4 text-left transition hover:border-violet-400/30 hover:bg-violet-500/15">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/20 p-2">
              <Sparkles
                size={18}
                className="text-violet-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">
                AI Assistant
              </p>

              <p className="text-xs text-slate-500">
                Coming soon
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom */}
      <div className="mt-auto">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-2xl px-4 py-3
                transition
                ${
                  isActive
                    ? "bg-violet-500/15 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon size={19} />

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Dynamic Profile */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white">
            {loading ? "..." : initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {loading ? "Loading..." : firstName}
            </p>

            <p className="truncate text-xs text-slate-500">
              Developer
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}