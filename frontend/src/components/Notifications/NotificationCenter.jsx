import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  FolderKanban,
  X,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.get("/tasks"),
        api.get("/events"),
        api.get("/projects"),
      ]);

      const taskResponse = results[0];
      const eventResponse = results[1];
      const projectResponse = results[2];

      const tasks =
        taskResponse.status === "fulfilled" &&
        Array.isArray(taskResponse.value.data)
          ? taskResponse.value.data
          : [];

      const events =
        eventResponse.status === "fulfilled" &&
        Array.isArray(eventResponse.value.data)
          ? eventResponse.value.data
          : [];

      const projects =
        projectResponse.status === "fulfilled" &&
        Array.isArray(projectResponse.value.data)
          ? projectResponse.value.data
          : [];

      const notifications = [];

      // -----------------------------
      // Tasks
      // -----------------------------
      tasks.slice(0, 3).forEach((task) => {
        notifications.push({
          id: `task-${task.id}`,
          type: "task",
          title: "Task reminder",
          message: task.title || "You have a pending task.",
          time: task.due_date
            ? `Due ${formatDate(task.due_date)}`
            : "Pending task",
          icon: CheckCircle2,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        });
      });

      // -----------------------------
      // Events
      // -----------------------------
      events.slice(0, 3).forEach((event) => {
        notifications.push({
          id: `event-${event.id}`,
          type: "event",
          title: "Upcoming event",
          message: event.title || "Upcoming event",
          time: event.event_date
            ? formatDate(event.event_date)
            : "Date not set",
          icon: CalendarDays,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        });
      });

      // -----------------------------
      // Projects
      // -----------------------------
      projects.slice(0, 2).forEach((project) => {
        notifications.push({
          id: `project-${project.id}`,
          type: "project",
          title: "Project activity",
          message: project.title || "Project updated",
          time: project.created_at
            ? formatDate(project.created_at)
            : "Recently created",
          icon: FolderKanban,
          color: "text-violet-400",
          bg: "bg-violet-500/10",
        });
      });

      setItems(notifications.slice(0, 8));
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const markAllRead = () => {
    setItems([]);
  };

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={() => {
          setOpen(!open);

          if (!open) {
            fetchNotifications();
          }
        }}
        className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          text-slate-400
          transition-all
          duration-200
          hover:bg-white/[0.08]
          hover:text-white
        "
      >
        <Bell size={19} />

        {items.length > 0 && (
          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-violet-500
              ring-2
              ring-[#050816]
            "
          />
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            z-50
            w-[380px]
            max-w-[calc(100vw-2rem)]
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-[#0b1020]/95
            shadow-2xl
            shadow-black/40
            backdrop-blur-2xl
          "
        >

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-5">

            <div>
              <h2 className="font-semibold text-white">
                Notifications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Stay updated with your workspace
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                p-2
                text-slate-500
                transition
                hover:bg-white/5
                hover:text-white
              "
            >
              <X size={17} />
            </button>

          </div>

          {/* Notifications */}
          <div className="max-h-[360px] overflow-y-auto">

            {loading ? (
              <div className="flex items-center justify-center px-6 py-12 text-slate-500">

                <Loader2
                  size={20}
                  className="mr-2 animate-spin"
                />

                Loading notifications...

              </div>
            ) : items.length === 0 ? (

              <div className="px-6 py-12 text-center">

                <Bell
                  size={32}
                  className="mx-auto mb-3 text-slate-600"
                />

                <p className="text-sm text-slate-400">
                  You're all caught up
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  No new workspace activity.
                </p>

              </div>

            ) : (

              items.map((notification) => {

                const Icon = notification.icon;

                return (
                  <div
                    key={notification.id}
                    className="
                      group
                      flex
                      gap-3
                      border-b
                      border-white/5
                      p-4
                      transition
                      hover:bg-white/5
                    "
                  >

                    {/* Icon */}
                    <div
                      className={`rounded-xl ${notification.bg} p-2.5`}
                    >
                      <Icon
                        size={18}
                        className={notification.color}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-medium text-white">
                        {notification.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[11px] text-slate-600">
                        {notification.time}
                      </p>

                    </div>

                  </div>
                );
              })

            )}

          </div>

          {/* Footer */}
          {items.length > 0 && !loading && (
            <div className="border-t border-white/10 p-3">

              <button
                onClick={markAllRead}
                className="
                  w-full
                  rounded-xl
                  py-2
                  text-xs
                  font-medium
                  text-violet-400
                  transition
                  hover:bg-violet-500/10
                "
              >
                Mark all as read
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}


/* ---------------------------------
   Date Formatter
---------------------------------- */

function formatDate(date) {
  if (!date) {
    return "Date not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}