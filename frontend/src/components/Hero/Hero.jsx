import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
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
      className="relative overflow-hidden rounded-3xl p-8 ..."
    >
      {/* Background Blur */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-yellow-300">
            <Sparkles size={18} />
            <span className="font-medium">Welcome back</span>
          </div>

          <h1 className="mt-3 text-4xl font-bold">
            Good Evening, Jagadeesh 👋
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