export interface PurchaseRow {
  id: string;
  order_id: string;
  sku: string;
  product_type: 'non_consumable' | 'consumable';
  amount: number;
  status: 'DONE' | 'REFUNDED';
  granted_at: string;
  created_at: string;
}
