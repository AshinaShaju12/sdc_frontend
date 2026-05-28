import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
     <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

<button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200">
  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0071C1]">
    <User className="w-4 h-4" />
  </div>
  <div className="hidden sm:flex flex-col items-start">
    <span className="text-sm font-semibold text-gray-700 leading-tight">
      Admin User
    </span>
    <span className="text-[11px] text-gray-500">
      Sales Manager
    </span>
  </div>
</button>
    </header>
  );
}
