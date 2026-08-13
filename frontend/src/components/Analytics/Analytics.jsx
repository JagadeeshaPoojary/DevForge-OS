import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskAnalytics = async () => {
      try {
        const response = await api.get("/tasks");

        const tasks = Array.isArray(response.data)
          ? response.data
          : response.data?.tasks || [];

        // Create seven buckets: Mon -> Sun
        const counts = [0, 0, 0, 0, 0, 0, 0];

        tasks.forEach((task) => {
          // Try common task date fields
          const rawDate =
            task.created_at ||
            task.createdAt ||
            task.due_date ||
            task.dueDate;

          if (!rawDate) return;

          const date = new Date(rawDate);

          if (Number.isNaN(date.getTime())) return;

          // JavaScript:
          // Sunday = 0
          // Monday = 1
          // ...
          // Saturday = 6
          const day = date.getDay();

          // Convert Sunday-first to Monday-first
          const mondayIndex = day === 0 ? 6 : day - 1;

          counts[mondayIndex]++;
        });

        setWeeklyData(counts);
      } catch (error) {
        console.error("Failed to load task analytics:", error);

        setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAnalytics();
  }, []);

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

    datasets: [
      {
        label: "Tasks Created",
        data: weeklyData,

        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.15)",

        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,

        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            return ` Tasks: ${context.raw}`;
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
        },

        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#94a3b8",
          precision: 0,
          stepSize: 1,
        },

        grid: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },
  };

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-white">
          Weekly Task Activity
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Tasks created during the week
        </p>
      </div>

      <div className="h-[300px]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-400">
              Loading analytics...
            </p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>

    </div>
  );
}