'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { customerApi } from '@/lib/api/customer.api';
import type { Customer, CustomerSearchParams, CustomerStatus, CustomerType } from '@/types/customer';
import {
  Plus, Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Eye, Pencil, Trash2, CheckCircle, XCircle, AlertTriangle,
  Building2, User, ArrowUpDown,
} from 'lucide-react';

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CustomerStatus }) {
  const map: Record<CustomerStatus, { label: string; cls: string }> = {
    ACTIVE:   { label: 'Active',   cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    INACTIVE: { label: 'Inactive', cls: 'bg-slate-500/15  text-slate-400  border-slate-500/30'  },
    BLOCKED:  { label: 'Blocked',  cls: 'bg-red-500/15    text-red-400    border-red-500/30'    },
    PENDING:  { label: 'Pending',  cls: 'bg-amber-500/15  text-amber-400  border-amber-500/30'  },
    ARCHIVED: { label: 'Archived', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  };
  const { label, cls } = map[status] ?? map.ACTIVE;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Customer Type Badge ──────────────────────────────────────────────────────
function TypeBadge({ type }: { type: CustomerType }) {
  const colors: Record<CustomerType, string> = {
    INDIVIDUAL:  'text-blue-400',
    COMPANY:     'text-violet-400',
    GOVERNMENT:  'text-amber-400',
    OEM:         'text-cyan-400',
    CEM:         'text-pink-400',
    DISTRIBUTOR: 'text-orange-400',
  };
  return <span className={`text-xs font-medium ${colors[type] ?? 'text-slate-400'}`}>{type}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers]     = useState<Customer[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const [params, setParams] = useState<CustomerSearchParams>({
    page: 0, size: 20, sortBy: 'createdAt', sortDir: 'desc',
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CustomerType | ''>('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('');

  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async (p: CustomerSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerApi.search(p);
      const page = res.data.data;
      setCustomers(page.content);
      setTotal(page.totalElements);
      setTotalPages(page.totalPages);
    } catch {
      setError('Failed to load customers. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(params); }, [params, load]);

  const handleSearch = () => {
    const next: CustomerSearchParams = {
      ...params, page: 0,
      search:       search       || undefined,
      customerType: typeFilter   || undefined,
      status:       statusFilter || undefined,
    };
    setParams(next);
  };

  const handleSort = (field: string) => {
    setParams(p => ({
      ...p,
      sortBy: field,
      sortDir: p.sortBy === field && p.sortDir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`Soft-delete "${name}"? The record will be archived.`)) return;
    setDeleting(uuid);
    try {
      await customerApi.delete(uuid);
      showToast(`"${name}" deleted successfully.`, 'success');
      load(params);
    } catch {
      showToast('Delete failed. Try again.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-full space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-fade-in ${
          toast.type === 'success'
            ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-300'
            : 'bg-red-900/90 border-red-500/40 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Customers</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {total.toLocaleString()} total customers
          </p>
        </div>
        <Link href="/erp/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#1a5fa0] text-sm font-semibold text-white transition-colors">
          <Plus size={15} /> New Customer
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, code, GST…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/50"
          />
        </div>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as CustomerType | '')}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-[#0F4C81] min-w-[150px]"
        >
          <option value="">All Types</option>
          {['INDIVIDUAL','COMPANY','GOVERNMENT','OEM','CEM','DISTRIBUTOR'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as CustomerStatus | '')}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-[#0F4C81] min-w-[130px]"
        >
          <option value="">All Status</option>
          {['ACTIVE','INACTIVE','BLOCKED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Apply & Reset */}
        <button onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#1a5fa0] text-sm font-semibold text-white transition-colors">
          <Filter size={13} /> Apply
        </button>
        <button onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); setParams({ page: 0, size: 20, sortBy: 'createdAt', sortDir: 'desc' }); }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm text-slate-400 transition-colors">
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0F1923] overflow-hidden">
        {error ? (
          <div className="flex items-center gap-3 p-8 text-amber-400">
            <AlertTriangle size={18} /> {error}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-[#0F4C81] border-t-transparent animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No customers found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new customer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  {[
                    { label: 'Customer',      field: 'companyName' },
                    { label: 'Code',          field: 'customerCode' },
                    { label: 'Type',          field: 'customerType' },
                    { label: 'GST',           field: 'gstNumber' },
                    { label: 'City',          field: 'city' },
                    { label: 'Credit Limit',  field: 'creditLimit' },
                    { label: 'Status',        field: 'status' },
                    { label: 'Actions',       field: null },
                  ].map(({ label, field }) => (
                    <th key={label}
                      onClick={field ? () => handleSort(field) : undefined}
                      className={`px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${field ? 'cursor-pointer hover:text-slate-300 select-none' : ''}`}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {field && <ArrowUpDown size={11} className="opacity-40" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c.uuid} className="hover:bg-white/3 transition-colors group">
                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81]/30 text-[#4a9fd4]">
                          {c.customerType === 'INDIVIDUAL' ? <User size={13} /> : <Building2 size={13} />}
                        </div>
                        <div>
                          <p className="font-medium text-white leading-tight">{c.companyName}</p>
                          {c.email && <p className="text-xs text-slate-500 leading-tight">{c.email}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Code */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
                        {c.customerCode}
                      </span>
                    </td>
                    {/* Type */}
                    <td className="px-4 py-3.5"><TypeBadge type={c.customerType} /></td>
                    {/* GST */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-400">{c.gstNumber ?? '—'}</span>
                    </td>
                    {/* City */}
                    <td className="px-4 py-3.5 text-slate-400">{c.city ?? '—'}</td>
                    {/* Credit Limit */}
                    <td className="px-4 py-3.5 text-slate-300">
                      {c.creditLimit
                        ? `₹${Number(c.creditLimit).toLocaleString('en-IN')}`
                        : '—'
                      }
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/erp/customers/${c.uuid}`}
                          title="View" className="p-1.5 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors">
                          <Eye size={13} />
                        </Link>
                        <Link href={`/erp/customers/${c.uuid}/edit`}
                          title="Edit" className="p-1.5 rounded-lg hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors">
                          <Pencil size={13} />
                        </Link>
                        <button
                          title="Delete"
                          disabled={deleting === c.uuid}
                          onClick={() => handleDelete(c.uuid, c.companyName)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          {deleting === c.uuid
                            ? <RefreshCw size={13} className="animate-spin" />
                            : <Trash2 size={13} />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {(params.page ?? 0) + 1} of {totalPages} — {total.toLocaleString()} customers
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={(params.page ?? 0) === 0}
              onClick={() => setParams(p => ({ ...p, page: (p.page ?? 0) - 1 }))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <button
              disabled={(params.page ?? 0) >= totalPages - 1}
              onClick={() => setParams(p => ({ ...p, page: (p.page ?? 0) + 1 }))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
