'use client';

import { useState } from 'react';
import { ERPSidebar } from '@/components/erp/ERPSidebar';
import { ERPTopbar } from '@/components/erp/ERPTopbar';
import { usePathname } from 'next/navigation';

function getTitle(pathname: string): string {
  if (pathname.startsWith('/erp/customers/') && pathname.endsWith('/edit')) return 'Edit Customer';
  if (pathname.startsWith('/erp/customers/new')) return 'New Customer';
  if (pathname.startsWith('/erp/customers/') && pathname.split('/').length === 4) return 'Customer Details';
  if (pathname.startsWith('/erp/customers')) return 'Customers';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/profile')) return 'Settings';
  return 'ERP';
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0A0F14] text-white overflow-hidden">
      <ERPSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ERPTopbar
          onMenuClick={() => setSidebarOpen(true)}
          title={getTitle(pathname)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
