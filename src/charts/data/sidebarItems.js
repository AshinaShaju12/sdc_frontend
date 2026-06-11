import { 
  LayoutDashboard, 
  Settings,
  Home,
  History,
  Briefcase,
  Users,
  LineChart
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
    name: 'Company Analysis',
    path: '/details',
    icon: LineChart,
  },
  {
    name: 'Meeting Prep',
    path: '/meeting-prep',
    icon: Users,
  },
  {
    name: 'Deal Coach',
    path: '/deal-coach',
    icon: Briefcase,
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
