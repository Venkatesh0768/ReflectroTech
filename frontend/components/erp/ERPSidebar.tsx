'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CircuitBoard,
  Users,
  ShoppingCart,
  Package,
  Factory,
  BarChart3,
  Settings,
  ChevronLeft,
  LayoutDashboard,
  Truck,
  ClipboardCheck,
  Warehouse,
  UserCog,
  X,
} from 'lucide-react';
import { useState } from 'react';

const nav = [
  { label: 'Dashboard',   href: '/dashboard',       icon: LayoutDashboard, active: true  },
  { label: '─── CRM ───', href: '#',                icon: null,            header: true  },
  { label: 'Customers',   href: '/erp/customers',   icon: Users,           active: true  },
  { label: '─── Supply Chain ───', href: '#',       icon: null,            header: true  },
  { label: 'Suppliers',   href: '#',                icon: Truck,           active: false },
  { label: 'Purchase',    href: '#',                icon: ShoppingCart,    active: false },
  { label: 'Inventory',   href: '#',                icon: Warehouse,       active: false },
  { label: '─── Production ───', href: '#',         icon: null,            header: true  },
  { label: 'Products',    href: '#',                icon: CircuitBoard,    active: false },
  { label: 'Work Orders', href: '#',                icon: Factory,         active: false },
  { label: 'Quality',     href: '#',                icon: ClipboardCheck,  active: false },
  { label: 'Dispatch',    href: '#',                icon: Package,         active: false },
  { label: '─── Admin ───', href: '#',              icon: null,            header: true  },
  { label: 'Reports',     href: '#',                icon: BarChart3,       active: false },
  { label: 'HR',          href: '#',                icon: UserCog,         active: false },
  { label: 'Settings',    href: '#',                icon: Settings,        active: false },
];

interface ERPSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ERPSidebar({ open, onClose }: ERPSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        bg-[#0D1117] border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F4C81]">
              <CircuitBoard size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">RF Electrotech</p>
              <p className="text-[10px] text-slate-500 leading-none">ERP System</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {nav.map((item) => {
            if ((item as any).header) {
              return (
                <p key={item.label} className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 select-none">
                  {item.label.replace(/─+\s*/g, '').replace(/\s*─+/g, '')}
                </p>
              );
            }

            const Icon = item.icon!;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isDisabled = !item.active;

            return (
              <Link
                key={item.href + item.label}
                href={isDisabled ? '#' : item.href}
                onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isDisabled
                    ? 'text-slate-700 cursor-not-allowed'
                    : isActive
                      ? 'bg-[#0F4C81]/80 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }
                `}
              >
                <Icon size={15} className={isActive ? 'text-white' : isDisabled ? 'text-slate-700' : 'text-slate-500'} />
                <span>{item.label}</span>
                {isDisabled && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-600 font-mono">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom version */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] text-slate-600">ERP v1.0 · Phase 2 Active</p>
        </div>
      </aside>
    </>
  );
}

export function ERPSidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
    >
      <ChevronLeft size={16} className="rotate-180" />
    </button>
  );
}
