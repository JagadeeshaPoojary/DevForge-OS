import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
} from "lucide-react";
import api from "../../services/api";
import Skeleton from "../UI/Skeleton";
import toast from "react-hot-toast";

export default function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(false);

        const response = await api.get("/tasks");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.tasks || [];

        // Show latest 5 tasks
        setTasks(data.slice(0, 5));
      } catch (error) {
  console.error("FAILED TO LOAD TASKS");
  console.error("Status:", error.response?.status);
  console.error("Response:", error.response?.data);
  console.error("Message:", error.message);

  setError(true);
} finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Today's Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your latest tasks
          </p>
        </div>

       

        <div className="rounded-xl bg-violet-500/20 px-3 py-2 text-sm font-medium text-violet-300">
          {tasks.length}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-center gap-3">

                <Skeleton className="h-5 w-5 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

                <Skeleton className="h-6 w-14" />

              </div>
            </div>
          ))}
        </div>

      ) : error ? (

        /* Error State */
        <div className="py-10 text-center">

         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
            <Circle
              size={24}
              className="text-red-400"
            />
          </div>

          <p className="font-medium text-red-400">
            Unable to load tasks
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please check your connection and try again.
          </p>

        </div>

      ) : tasks.length === 0 ? (

        /* Empty State */
        <div className="py-10 text-center">

          <Circle
            size={36}
            className="mx-auto mb-3 text-slate-600"
          />

          <p className="text-slate-400">
            No tasks yet.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Create a task to see it here.
          </p>

        </div>

      ) : (

        /* Task List */
        <div className="space-y-3">

          {tasks.map((task) => {

            const completed =
              task.completed === true ||
              task.status?.toLowerCase() === "completed";

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
                  bg-white/5
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-violet-500/20
                  hover:bg-white/10
                  hover:shadow-lg
                  hover:shadow-violet-950/20
                "
              >

                {/* Status Icon */}
                <div className="shrink-0">

                  {completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-slate-500 transition-colors group-hover:text-violet-400"
                    />
                  )}

                </div>

                {/* Task Information */}
                <div className="min-w-0 flex-1">

                  <p
                    className={`truncate font-medium ${
                      completed
                        ? "text-slate-500 line-through"
                        : "text-white"
                    }`}
                  >
                    {task.title}
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
                    className="
                      shrink-0
                      rounded-lg
                      border
                      border-white/5
                      bg-white/5
                      px-2
                      py-1
                      text-xs
                      capitalize
                      text-slate-400
                    "
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