import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  DollarSign,
  BarChart3,
  Bell,
  Settings,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Vehicles',
    path: '/vehicles',
    icon: Truck,
  },
  {
    label: 'Drivers',
    path: '/drivers',
    icon: Users,
  },
  {
    label: 'Trips',
    path: '/trips',
    icon: MapPin,
  },
  {
    label: 'Maintenance',
    path: '/maintenance',
    icon: Wrench,
  },
  {
    label: 'Fuel & Expenses',
    path: '/fuel-expenses',
    icon: Fuel,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
  },
];

export const SECONDARY_NAVIGATION: NavItem[] = [
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    badge: '3',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];
