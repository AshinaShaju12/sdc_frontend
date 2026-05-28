import { 
  LayoutDashboard, 
  Settings,
  Home,
  History
} from 'lucide-react';

export const sidebarItems = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'History',
    path: '/history',
    icon: History,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];
