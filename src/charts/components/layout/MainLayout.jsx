import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { History, Settings } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F4FCFF]">
      {/* Topbar */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="text-gray-900 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
            SalesIntel<span className="text-blue-600">AI</span>
          </NavLink>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          <NavLink 
            to="/history" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`
            }
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">History</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Settings</span>
          </NavLink>
        </nav>
      </header>

      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
