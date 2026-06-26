// ─── Types ────────────────────────────────────────────────────────────────────

export type CustomerType = 'INDIVIDUAL' | 'COMPANY' | 'GOVERNMENT' | 'OEM' | 'CEM' | 'DISTRIBUTOR';
export type GstType = 'REGISTERED' | 'UNREGISTERED' | 'COMPOSITION' | 'EXPORT' | 'CONSUMER';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING' | 'ARCHIVED';

export interface Customer {
  uuid: string;
  customerCode: string;
  companyName: string;
  displayName?: string;
  customerType: CustomerType;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gstNumber?: string;
  gstType: GstType;
  panNumber?: string;
  creditLimit?: number;
  paymentTermsDays?: number;
  notes?: string;
  contactPerson?: string;
  contactDesignation?: string;
  status: CustomerStatus;
  deleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CustomerRequest {
  companyName: string;
  displayName?: string;
  customerType: CustomerType;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gstNumber?: string;
  gstType?: GstType;
  panNumber?: string;
  creditLimit?: number;
  paymentTermsDays?: number;
  notes?: string;
  contactPerson?: string;
  contactDesignation?: string;
}

export interface CustomerSearchParams {
  search?: string;
  customerType?: CustomerType;
  gstType?: GstType;
  status?: CustomerStatus;
  city?: string;
  state?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
