import {
  FolderKanban,
  CheckSquare,
  StickyNote,
  CalendarDays,
} from "lucide-react";

import useDashboard from "../../hooks/useDashboard";

export default function Stats() {
  const { dashboard, loading } = useDashboard();

  const stats = [
    {
      title: "Projects",
      value: dashboard.projects,
      icon: FolderKanban,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Tasks",
      value: dashboard.tasks,
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Notes",
      value: dashboard.notes,
      icon: StickyNote,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Events",
      value: dashboard.events,
      icon: CalendarDays,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, icon: Icon, color }) => (
        <div
          key={title}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">{title}</span>
            <span className={`rounded-xl bg-gradient-to-br ${color} p-2.5`}>
              <Icon size={20} className="text-white" />
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-white">
            {loading ? "—" : value ?? 0}
          </p>
        </div>
      ))}
    </section>
  );
}
