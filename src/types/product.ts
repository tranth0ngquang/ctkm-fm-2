export interface Product {
  section: string;
  type: 'discount_50' | 'discount_33' | 'gift_promo';
  item_code: string;
  name: string;
  price_normal: number | null;
  price_discount: number | null;
  image: string;
  promotion: string;
  group_id?: string;
  group_name?: string;
}
