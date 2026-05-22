function CoachingCard({ topic, summary }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
      <div className="text-sm font-semibold">{topic}</div>
      <p className="mt-2 text-slate-400">{summary}</p>
    </div>
  );
}

export default CoachingCard;
