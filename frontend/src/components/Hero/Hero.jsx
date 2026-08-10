import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  // Get currently logged-in user
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // Get first name
  const firstName =
    user?.full_name?.trim()?.split(" ")[0] || "Developer";

  // Dynamic greeting based on current time
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.005,
      }}
      className="relative overflow-hidden rounded-3xl p-8"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 via-blue-600/20 to-cyan-500/20" />

      <div className="relative flex items-center justify-between">
        <div>

          <div className="flex items-center gap-2 text-yellow-300">
            <Sparkles size={18} />

            <span className="font-medium">
              Welcome back
            </span>
          </div>

          <h1 className="mt-3 text-4xl font-bold text-white">
            {greeting}, {firstName} 👋
          </h1>

          <p className="mt-3 max-w-xl text-white/80">
            Manage projects, tasks, notes and events from one
            premium workspace.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-900 shadow-xl transition hover:scale-105">
          Start Working
          <ArrowRight size={18} />
        </button>

      </div>
    </motion.div>
  );
}