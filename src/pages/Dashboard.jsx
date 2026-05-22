import StatCard from '../components/StatCard';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Revenue" value="$1.2M" icon="📈" />
        <StatCard title="Opportunities" value="24" icon="💼" />
        <StatCard title="Signals" value="9" icon="⚡" />
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-200">
        <h2 className="text-xl font-semibold">Welcome to AI Sales</h2>
        <p className="mt-3 text-slate-400">This workspace is ready for route and feature expansion.</p>
      </div>
    </div>
  );
}

export default Dashboard;
