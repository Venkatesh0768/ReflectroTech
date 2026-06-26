'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, Menu, Search, User } from 'lucide-react';

interface ERPTopbarProps {
  onMenuClick: () => void;
  title: string;
}

export function ERPTopbar({ onMenuClick, title }: ERPTopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0D1117] border-b border-white/10 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#00A86B]" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4C81] text-white text-xs font-bold">
            {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-red-500/15 hover:text-red-400 transition-colors"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
