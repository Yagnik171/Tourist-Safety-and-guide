'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Map,
  Bell,
  Navigation,
  MessageCircle,
  Flag,
  Phone,
  Calendar,
  Star,
  Languages,
  Shield,
  User,
  AlertOctagon,
  BarChart,
  Users,
  MapPin,
} from 'lucide-react';
import { TOURIST_NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/constants';
import { useAppStore } from '@/lib/store';
import { SOSButton } from '@/components/sos/SOSButton';
import { cn } from '@/lib/utils';

interface SidebarProps {
  type?: 'tourist' | 'admin';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  search: Search,
  map: Map,
  bell: Bell,
  navigation: Navigation,
  'message-circle': MessageCircle,
  flag: Flag,
  phone: Phone,
  calendar: Calendar,
  star: Star,
  languages: Languages,
  shield: Shield,
  user: User,
  'alert-octagon': AlertOctagon,
  'bar-chart': BarChart,
  users: Users,
  'map-pin': MapPin,
};

export const Sidebar: React.FC<SidebarProps> = ({ type = 'tourist' }) => {
  const pathname = usePathname();
  const { isSafetyModeActive } = useAppStore();

  const items = type === 'admin' ? ADMIN_NAV_ITEMS : TOURIST_NAV_ITEMS;

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-6">
        {/* Safety Mode Banner in Sidebar */}
        {type === 'tourist' && isSafetyModeActive && (
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold text-cyan-300">Safety Mode Active</span>
            </div>
            <Link href="/safety-mode" className="text-[10px] text-cyan-400 hover:underline">
              Settings
            </Link>
          </div>
        )}

        {/* Navigation list */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Emergency SOS Card */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <div className="text-[11px] text-slate-400 px-1 font-medium">Quick Emergency Access</div>
        <SOSButton variant="full" />
      </div>
    </aside>
  );
};
