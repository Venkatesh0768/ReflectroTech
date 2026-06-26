'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { customerApi } from '@/lib/api/customer.api';
import type { Customer } from '@/types/customer';
import CustomerForm from '@/components/erp/customers/CustomerForm';
import { AlertTriangle } from 'lucide-react';

export default function EditCustomerPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    customerApi.getByUuid(uuid)
      .then(r => setCustomer(r.data.data))
      .catch(() => setError('Could not load customer.'))
      .finally(() => setLoading(false));
  }, [uuid]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="h-8 w-8 rounded-full border-2 border-[#0F4C81] border-t-transparent animate-spin" />
    </div>
  );

  if (error || !customer) return (
    <div className="flex items-center justify-center min-h-[400px] gap-3 text-amber-400">
      <AlertTriangle size={20} /> {error ?? 'Customer not found'}
    </div>
  );

  return <CustomerForm mode="edit" initial={customer} />;
}
