import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 rounded-3xl bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
