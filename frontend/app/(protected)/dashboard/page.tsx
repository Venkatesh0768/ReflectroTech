'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, Loader2, Shield, User, XCircle, Users, Activity, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/utils/roles";

export default function DashboardPage() {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login?redirect=/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-2 border-[#0F4C81] border-t-transparent animate-spin" />
      </div>
    );
  }

  const admin = isAdmin(user);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#4a9fd4] mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Account */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0F1923]">
          <div className="flex items-center gap-2 mb-4">
            <User size={15} className="text-[#4a9fd4]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Account</span>
          </div>
          <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-3">{user?.email}</p>
          <div className="flex flex-wrap gap-1.5">
            {user?.roles.map((role) => (
              <span key={role} className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                role === "ROLE_ADMIN" 
                  ? "bg-[#0F4C81]/30 text-[#4a9fd4] border border-[#0F4C81]/50" 
                  : "bg-white/5 text-slate-400 border border-white/10"
              }`}>
                {role.replace("ROLE_", "")}
              </span>
            ))}
          </div>
        </div>

        {/* Session */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0F1923]">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-[#00A86B]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Session</span>
          </div>
          <div className="space-y-3">
            <InfoRow label="Provider" value={<span className="capitalize">{user?.provider}</span>} />
            <InfoRow
              label="Email verified"
              value={
                user?.emailVerified
                  ? <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={13} /> Verified</span>
                  : <span className="flex items-center gap-1 text-red-400"><XCircle size={13} /> Unverified</span>
              }
            />
            <InfoRow
              label="Status"
              value={
                <span className={`flex items-center gap-1.5 ${user?.enabled ? "text-emerald-400" : "text-red-400"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${user?.enabled ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-red-400"}`} />
                  {user?.enabled ? "Active" : "Disabled"}
                </span>
              }
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0F1923]">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Quick Actions</span>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/erp/customers" className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors">
              <span className="flex items-center gap-2"><Users size={14} className="text-slate-400" /> Customers</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>
            <Link href="/profile" className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors">
              <span className="flex items-center gap-2"><User size={14} className="text-slate-400" /> Settings</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>
            {admin && (
              <Link href="/admin" className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors">
                <span className="flex items-center gap-2"><Shield size={14} className="text-slate-400" /> Admin Panel</span>
                <ArrowRight size={14} className="text-slate-500" />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* System Status placeholder */}
      <div className="mt-8 p-6 rounded-2xl border border-white/10 bg-[#0F1923] flex flex-col items-center justify-center text-center min-h-[200px]">
         <BarChart3 size={32} className="text-slate-600 mb-3" />
         <h3 className="text-lg font-medium text-white mb-1">System Overview</h3>
         <p className="text-sm text-slate-400 max-w-sm">Analytics and system overview widgets will be deployed in the next phase of the ERP implementation.</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-medium text-slate-300">{value}</span>
    </div>
  );
}
