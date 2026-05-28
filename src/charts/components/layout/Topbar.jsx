import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
     <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>


    </header>
  );
}
