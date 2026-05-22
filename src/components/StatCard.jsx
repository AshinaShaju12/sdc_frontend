function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-sm shadow-slate-950/20">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-4 text-slate-400">{icon}</div>
    </div>
  );
}

export default StatCard;
