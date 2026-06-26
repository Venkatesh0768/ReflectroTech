'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { customerApi } from '@/lib/api/customer.api';
import type { Customer, CustomerStatus } from '@/types/customer';
import {
  ArrowLeft, Pencil, Trash2, CheckCircle, XCircle, AlertTriangle,
  Building2, Mail, Phone, MapPin, Globe, Shield,
  CreditCard, Calendar, User, FileText, RefreshCw, Tag,
} from 'lucide-react';

function DetailRow({ label, value, mono }: { label: string; value?: string | number | null; mono?: boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</span>
      <span className={`text-sm text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: CustomerStatus }) {
  const map: Record<CustomerStatus, { label: string; cls: string }> = {
    ACTIVE:   { label: 'Active',   cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    INACTIVE: { label: 'Inactive', cls: 'bg-slate-500/15  text-slate-400  border-slate-500/30'  },
    BLOCKED:  { label: 'Blocked',  cls: 'bg-red-500/15    text-red-400    border-red-500/30'    },
    PENDING:  { label: 'Pending',  cls: 'bg-amber-500/15  text-amber-400  border-amber-500/30'  },
    ARCHIVED: { label: 'Archived', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  };
  const { label, cls } = map[status] ?? map.ACTIVE;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>{label}</span>;
}

export default function CustomerDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    customerApi.getByUuid(uuid)
      .then(r => setCustomer(r.data.data))
      .catch(() => setError('Customer not found.'))
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleDelete = async () => {
    if (!customer) return;
    if (!confirm(`Soft-delete "${customer.companyName}"?`)) return;
    setDeleting(true);
    try {
      await customerApi.delete(uuid);
      showToast('Customer deleted.', true);
      setTimeout(() => router.push('/erp/customers'), 1500);
    } catch {
      showToast('Delete failed.', false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="h-8 w-8 rounded-full border-2 border-[#0F4C81] border-t-transparent animate-spin" />
    </div>
  );

  if (error || !customer) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-amber-400">
      <AlertTriangle size={32} className="opacity-50" />
      <p>{error ?? 'Customer not found'}</p>
      <Link href="/erp/customers" className="text-sm text-slate-400 hover:text-white">← Back to customers</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium animate-fade-in ${
          toast.ok ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-300' : 'bg-red-900/90 border-red-500/40 text-red-300'
        }`}>
          {toast.ok ? <CheckCircle size={14} /> : <XCircle size={14} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-slate-700">/</span>
          <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
            {customer.customerCode}
          </span>
          <StatusBadge status={customer.status} />
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/erp/customers/${uuid}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors">
            <Pencil size={13} /> Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
            {deleting ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1923]">
        {/* Company name + type */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F4C81]/30 text-[#4a9fd4]">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{customer.companyName}</h2>
            {customer.displayName && customer.displayName !== customer.companyName && (
              <p className="text-sm text-slate-400">aka {customer.displayName}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                {customer.customerType}
              </span>
              <span className="text-xs text-slate-500">{customer.gstType}</span>
            </div>
          </div>
        </div>

        {/* Grid of details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 border-b border-white/5 pb-2">Contact</p>
            {customer.email && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail size={13} className="text-slate-500 shrink-0" />
                <a href={`mailto:${customer.email}`} className="hover:text-white transition-colors">{customer.email}</a>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone size={13} className="text-slate-500 shrink-0" />
                <a href={`tel:${customer.phone}`} className="hover:text-white transition-colors">{customer.phone}</a>
              </div>
            )}
            {customer.alternatePhone && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone size={13} className="text-slate-500 shrink-0" />
                {customer.alternatePhone}
              </div>
            )}
            {customer.website && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Globe size={13} className="text-slate-500 shrink-0" />
                <a href={customer.website} target="_blank" rel="noreferrer" className="hover:text-white transition-colors truncate">{customer.website}</a>
              </div>
            )}
            {customer.contactPerson && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User size={13} className="text-slate-500 shrink-0" />
                <span>{customer.contactPerson}{customer.contactDesignation ? ` (${customer.contactDesignation})` : ''}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 border-b border-white/5 pb-2">Address</p>
            {(customer.addressLine1 || customer.city) && (
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin size={13} className="text-slate-500 shrink-0 mt-0.5" />
                <div>
                  {customer.addressLine1 && <p>{customer.addressLine1}</p>}
                  {customer.addressLine2 && <p>{customer.addressLine2}</p>}
                  {(customer.city || customer.state) && (
                    <p>{[customer.city, customer.state, customer.pincode].filter(Boolean).join(', ')}</p>
                  )}
                  {customer.country && <p className="text-slate-500">{customer.country}</p>}
                </div>
              </div>
            )}
          </div>

          {/* GST & Commercial */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 border-b border-white/5 pb-2">GST & Commercial</p>
            {customer.gstNumber && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Shield size={13} className="text-slate-500 shrink-0" />
                <span className="font-mono">{customer.gstNumber}</span>
              </div>
            )}
            {customer.panNumber && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Tag size={13} className="text-slate-500 shrink-0" />
                <span className="font-mono">{customer.panNumber}</span>
              </div>
            )}
            {customer.creditLimit !== undefined && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CreditCard size={13} className="text-slate-500 shrink-0" />
                Credit: ₹{Number(customer.creditLimit).toLocaleString('en-IN')}
              </div>
            )}
            {customer.paymentTermsDays !== undefined && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar size={13} className="text-slate-500 shrink-0" />
                Payment Terms: {customer.paymentTermsDays} day{customer.paymentTermsDays !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="sm:col-span-2 lg:col-span-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 border-b border-white/5 pb-2">
                Internal Notes
              </p>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <FileText size={13} className="text-slate-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{customer.notes}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Audit footer */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600 px-1">
        <span>Created: {new Date(customer.createdAt).toLocaleString()} by {customer.createdBy}</span>
        <span>Updated: {new Date(customer.updatedAt).toLocaleString()} by {customer.updatedBy}</span>
        <span>Version: {customer.version}</span>
      </div>
    </div>
  );
}
