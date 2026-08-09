export default function GlassCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/[0.045]
        backdrop-blur-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:border-white/20
        hover:bg-white/[0.07]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />

      <div className="relative">
        {children}
      </div>
    </div>
  );
}