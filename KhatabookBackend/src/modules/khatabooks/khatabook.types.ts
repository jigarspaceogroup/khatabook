/**
 * Khatabook Types
 * TypeScript interfaces for khatabook module
 */

export interface KhatabookStats {
  total_customers: number;
  total_receivable: number;
  total_payable: number;
  net_balance: number;
}

export interface DetailedKhatabookStats extends KhatabookStats {
  total_transactions: number;
  total_invoices: number;
  transactions_this_month: number;
  top_defaulters: Array<{
    customer_id: string;
    customer_name: string;
    balance: number;
  }>;
}

export interface CreateKhatabookRequest {
  name: string;
  business_name?: string;
  business_type?: 'retail' | 'wholesale' | 'services' | 'other';
  is_default?: boolean;
  currency_code?: string;
}

export interface UpdateKhatabookRequest {
  name?: string;
  business_name?: string;
  business_type?: 'retail' | 'wholesale' | 'services' | 'other';
  is_default?: boolean;
}

export interface KhatabookResponse {
  id: string;
  name: string;
  business_name: string | null;
  business_type: string | null;
  is_default: boolean;
  currency_code: string;
  stats: KhatabookStats;
  created_at: string;
  updated_at: string;
}

export interface DetailedKhatabookResponse extends Omit<KhatabookResponse, 'stats'> {
  stats: DetailedKhatabookStats;
}
