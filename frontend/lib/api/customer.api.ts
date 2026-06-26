import apiClient from './client';
import type {
  Customer,
  CustomerRequest,
  CustomerSearchParams,
  CustomerStatus,
  ApiResponse,
  PageResponse,
} from '@/types/customer';

// ─── Customer API client ──────────────────────────────────────────────────────

export const customerApi = {

  /** POST /customers — Create a new customer */
  create: (data: CustomerRequest) =>
    apiClient.post<ApiResponse<Customer>>('/customers', data),

  /** GET /customers/{uuid} — Fetch single customer by UUID */
  getByUuid: (uuid: string) =>
    apiClient.get<ApiResponse<Customer>>(`/customers/${uuid}`),

  /** GET /customers — Paginated search + filter list */
  search: (params: CustomerSearchParams = {}) =>
    apiClient.get<ApiResponse<PageResponse<Customer>>>('/customers', {
      params: {
        page:         params.page     ?? 0,
        size:         params.size     ?? 20,
        sortBy:       params.sortBy   ?? 'createdAt',
        sortDir:      params.sortDir  ?? 'desc',
        search:       params.search   || undefined,
        customerType: params.customerType || undefined,
        gstType:      params.gstType  || undefined,
        status:       params.status   || undefined,
        city:         params.city     || undefined,
        state:        params.state    || undefined,
      },
    }),

  /** PUT /customers/{uuid} — Update customer */
  update: (uuid: string, data: CustomerRequest) =>
    apiClient.put<ApiResponse<Customer>>(`/customers/${uuid}`, data),

  /** DELETE /customers/{uuid} — Soft delete */
  delete: (uuid: string) =>
    apiClient.delete<ApiResponse<void>>(`/customers/${uuid}`),

  /** PATCH /customers/{uuid}/status — Change status */
  changeStatus: (uuid: string, status: CustomerStatus) =>
    apiClient.patch<ApiResponse<Customer>>(`/customers/${uuid}/status`, null, {
      params: { status },
    }),
};
