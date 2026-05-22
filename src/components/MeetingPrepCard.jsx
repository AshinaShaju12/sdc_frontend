function MeetingPrepCard({ title, notes }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-3 text-slate-400">{notes}</div>
    </div>
  );
}

export default MeetingPrepCard;
