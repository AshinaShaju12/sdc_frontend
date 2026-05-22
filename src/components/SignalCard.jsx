function SignalCard({ signal, severity }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
      <div className="text-sm font-semibold">{signal}</div>
      <p className="mt-2 text-slate-400">Severity: {severity}</p>
    </div>
  );
}

export default SignalCard;
