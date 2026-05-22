function OpportunityCard({ name, value, stage }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
      <div className="text-lg font-semibold">{name}</div>
      <div className="mt-2 text-slate-400">Stage: {stage}</div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
    </div>
  );
}

export default OpportunityCard;
