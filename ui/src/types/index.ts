// 기본 타입 정의
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  options: ProductOption[];
}

export interface ProductOption {
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  basePrice: number;
  selectedOptions: ProductOption[];
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  timestamp: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'in_production' | 'completed';
}
