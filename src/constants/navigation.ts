import {
  LayoutDashboard,
  Brain,
  Apple,
  TrendingUp,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Coach', path: '/dashboard/coach', icon: Brain },
  { label: 'Nutrition', path: '/dashboard/nutrition', icon: Apple },
  { label: 'Progress', path: '/dashboard/progress', icon: TrendingUp },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];