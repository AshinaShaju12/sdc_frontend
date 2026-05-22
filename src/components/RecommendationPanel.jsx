function RecommendationPanel({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export default RecommendationPanel;
