import {
  FolderKanban,
  CheckSquare,
  StickyNote,
  CalendarDays,
} from "lucide-react";

import useDashboard from "../../hooks/useDashboard";

export default function Stats() {
  const {
    dashboard = {
      projects: 0,
      tasks: 0,
      notes: 0,
      events: 0,
    },
    loading = true,
  } = useDashboard();

  const stats = [
    {
      title: "Projects",
      value: dashboard?.projects ?? 0,
      icon: FolderKanban,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Tasks",
      value: dashboard?.tasks ?? 0,
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Notes",
      value: dashboard?.notes ?? 0,
      icon: StickyNote,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Events",
      value: dashboard?.events ?? 0,
      icon: CalendarDays,
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, icon: Icon, color }) => (
        <div
          key={title}
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            p-5
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-white/20
            hover:bg-white/10
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">
                {title}
              </p>

              <p className="mt-4 text-3xl font-bold text-white">
                {loading ? "—" : value}
              </p>
            </div>

            <div
              className={`
                rounded-2xl
                bg-gradient-to-br
                ${color}
                p-3
                shadow-lg
              `}
            >
              <Icon
                size={22}
                className="text-white"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}