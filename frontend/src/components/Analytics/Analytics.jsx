import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Coding Hours",
      data: [2, 5, 4, 6, 7, 3, 8],
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139,92,246,.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,.08)" },
    },
    y: {
      ticks: { color: "white" },
      grid: { color: "rgba(255,255,255,.08)" },
    },
  },
};

export default function Analytics() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-5">
        Weekly Coding Progress
      </h2>

      <Line data={data} options={options} />
    </div>
  );
}