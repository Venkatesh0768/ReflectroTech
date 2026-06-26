'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer, CustomerRequest, CustomerType, GstType } from '@/types/customer';
import { customerApi } from '@/lib/api/customer.api';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputCls = `w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white
  placeholder-slate-600 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/50
  transition-colors`;

const selectCls = `${inputCls} cursor-pointer`;

// ─── Section heading ──────────────────────────────────────────────────────────
function Section({ title }: { title: string }) {
  return (
    <div className="col-span-full border-t border-white/10 pt-6 mt-2">
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface CustomerFormProps {
  mode: 'create' | 'edit';
  initial?: Customer;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomerForm({ mode, initial }: CustomerFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CustomerRequest>({
    companyName:        initial?.companyName        ?? '',
    displayName:        initial?.displayName        ?? '',
    customerType:       initial?.customerType       ?? 'COMPANY',
    email:              initial?.email              ?? '',
    phone:              initial?.phone              ?? '',
    alternatePhone:     initial?.alternatePhone     ?? '',
    website:            initial?.website            ?? '',
    addressLine1:       initial?.addressLine1       ?? '',
    addressLine2:       initial?.addressLine2       ?? '',
    city:               initial?.city               ?? '',
    state:              initial?.state              ?? '',
    pincode:            initial?.pincode            ?? '',
    country:            initial?.country            ?? 'India',
    gstNumber:          initial?.gstNumber          ?? '',
    gstType:            initial?.gstType            ?? 'UNREGISTERED',
    panNumber:          initial?.panNumber          ?? '',
    creditLimit:        initial?.creditLimit        ?? 0,
    paymentTermsDays:   initial?.paymentTermsDays   ?? 0,
    contactPerson:      initial?.contactPerson      ?? '',
    contactDesignation: initial?.contactDesignation ?? '',
    notes:              initial?.notes              ?? '',
  });

  const set = (key: keyof CustomerRequest, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    if (!form.customerType)       errs.customerType = 'Customer type is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';
    if (form.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstNumber))
      errs.gstNumber = 'Invalid GSTIN format (15 characters expected)';
    if (form.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber))
      errs.panNumber = 'Invalid PAN format (e.g. AAAPL1234F)';
    if (form.phone && !/^[+]?[0-9]{10,15}$/.test(form.phone))
      errs.phone = 'Phone must be 10-15 digits';
    if (form.pincode && !/^[1-9][0-9]{5}$/.test(form.pincode))
      errs.pincode = 'Enter a valid 6-digit Indian PIN code';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setApiError(null);

    // Clean empty strings to undefined so backend ignores them
    const payload: CustomerRequest = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? undefined : v])
    ) as CustomerRequest;

    try {
      if (isEdit && initial) {
        await customerApi.update(initial.uuid, payload);
        router.push(`/erp/customers/${initial.uuid}`);
      } else {
        const res = await customerApi.create(payload);
        router.push(`/erp/customers/${res.data.data.uuid}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.errors?.[0]
        ?? 'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-slate-700">/</span>
        <span className="text-sm text-white font-medium">
          {isEdit ? `Edit ${initial?.customerCode}` : 'New Customer'}
        </span>
      </div>

      {/* Error banner */}
      {apiError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-900/20 text-sm text-red-300">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0F1923]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* ── Identity ──────────────────────────────────────── */}
            <Section title="Identity" />

            <Field label="Company Name" required error={fieldErrors.companyName}>
              <input className={inputCls} placeholder="Acme Circuits Pvt. Ltd."
                value={form.companyName} onChange={e => set('companyName', e.target.value)} />
            </Field>

            <Field label="Display / Trading Name">
              <input className={inputCls} placeholder="Acme Circuits"
                value={form.displayName ?? ''} onChange={e => set('displayName', e.target.value)} />
            </Field>

            <Field label="Customer Type" required error={fieldErrors.customerType}>
              <select className={selectCls}
                value={form.customerType} onChange={e => set('customerType', e.target.value as CustomerType)}>
                {['INDIVIDUAL','COMPANY','GOVERNMENT','OEM','CEM','DISTRIBUTOR'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            {/* ── Contact ───────────────────────────────────────── */}
            <Section title="Contact Information" />

            <Field label="Email" error={fieldErrors.email}>
              <input type="email" className={inputCls} placeholder="procurement@company.com"
                value={form.email ?? ''} onChange={e => set('email', e.target.value)} />
            </Field>

            <Field label="Phone" error={fieldErrors.phone}>
              <input className={inputCls} placeholder="+919876543210"
                value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
            </Field>

            <Field label="Alternate Phone">
              <input className={inputCls} placeholder="+919876543211"
                value={form.alternatePhone ?? ''} onChange={e => set('alternatePhone', e.target.value)} />
            </Field>

            <Field label="Website">
              <input className={inputCls} placeholder="https://company.com"
                value={form.website ?? ''} onChange={e => set('website', e.target.value)} />
            </Field>

            <Field label="Contact Person">
              <input className={inputCls} placeholder="Ramesh Kumar"
                value={form.contactPerson ?? ''} onChange={e => set('contactPerson', e.target.value)} />
            </Field>

            <Field label="Contact Designation">
              <input className={inputCls} placeholder="Purchase Manager"
                value={form.contactDesignation ?? ''} onChange={e => set('contactDesignation', e.target.value)} />
            </Field>

            {/* ── Address ───────────────────────────────────────── */}
            <Section title="Address" />

            <div className="sm:col-span-2">
              <Field label="Address Line 1">
                <input className={inputCls} placeholder="Plot No. 42, SIPCOT Industrial Estate"
                  value={form.addressLine1 ?? ''} onChange={e => set('addressLine1', e.target.value)} />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Address Line 2">
                <input className={inputCls} placeholder="Phase II, Sriperumbudur"
                  value={form.addressLine2 ?? ''} onChange={e => set('addressLine2', e.target.value)} />
              </Field>
            </div>

            <Field label="City">
              <input className={inputCls} placeholder="Chennai"
                value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
            </Field>

            <Field label="State">
              <input className={inputCls} placeholder="Tamil Nadu"
                value={form.state ?? ''} onChange={e => set('state', e.target.value)} />
            </Field>

            <Field label="PIN Code" error={fieldErrors.pincode}>
              <input className={inputCls} placeholder="602105" maxLength={6}
                value={form.pincode ?? ''} onChange={e => set('pincode', e.target.value)} />
            </Field>

            <Field label="Country">
              <input className={inputCls} placeholder="India"
                value={form.country ?? ''} onChange={e => set('country', e.target.value)} />
            </Field>

            {/* ── GST / Tax ─────────────────────────────────────── */}
            <Section title="GST & Tax" />

            <Field label="GST Type">
              <select className={selectCls}
                value={form.gstType ?? 'UNREGISTERED'}
                onChange={e => set('gstType', e.target.value as GstType)}>
                {['REGISTERED','UNREGISTERED','COMPOSITION','EXPORT','CONSUMER'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>

            <Field label="GSTIN" error={fieldErrors.gstNumber}>
              <input className={inputCls} placeholder="33AAAPL1234F1Z5" maxLength={15}
                value={form.gstNumber ?? ''} onChange={e => set('gstNumber', e.target.value.toUpperCase())} />
            </Field>

            <Field label="PAN Number" error={fieldErrors.panNumber}>
              <input className={inputCls} placeholder="AAAPL1234F" maxLength={10}
                value={form.panNumber ?? ''} onChange={e => set('panNumber', e.target.value.toUpperCase())} />
            </Field>

            {/* ── Commercial ────────────────────────────────────── */}
            <Section title="Commercial Terms" />

            <Field label="Credit Limit (₹)">
              <input type="number" min={0} step={0.01} className={inputCls} placeholder="500000"
                value={form.creditLimit ?? 0} onChange={e => set('creditLimit', parseFloat(e.target.value) || 0)} />
            </Field>

            <Field label="Payment Terms (Days)">
              <input type="number" min={0} max={365} className={inputCls} placeholder="30"
                value={form.paymentTermsDays ?? 0} onChange={e => set('paymentTermsDays', parseInt(e.target.value) || 0)} />
            </Field>

            {/* ── Notes ─────────────────────────────────────────── */}
            <Section title="Internal Notes" />

            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea rows={3} className={`${inputCls} resize-none`}
                  placeholder="Internal notes visible to the sales team only…"
                  value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} />
              </Field>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#1a5fa0] text-sm font-semibold text-white transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}
