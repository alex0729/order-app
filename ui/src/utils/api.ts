const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

// 메뉴 타입
export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock_quantity: number;
  category?: string;
  is_available: boolean;
  options: MenuOption[];
}

export interface MenuOption {
  id: number;
  name: string;
  price_modifier: number;
  option_type: string;
  is_required: boolean;
}

// 주문 타입
export interface Order {
  id: number;
  order_number: string;
  order_datetime: string;
  total_amount: number;
  status: '접수' | '제조중' | '완료' | '취소';
  customer_name?: string;
  customer_phone?: string;
  special_requests?: string;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  menu_id: number;
  menu_name?: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  selected_options?: SelectedOption[];
}

export interface SelectedOption {
  option_id?: number;
  value?: string;
}

export interface CreateOrderRequest {
  customer_name?: string;
  customer_phone?: string;
  special_requests?: string;
  items: OrderItem[];
}

export interface OrderStats {
  total_orders: number;
  received_orders: number;
  in_production_orders: number;
  completed_orders: number;
}

// HTTP 요청 헬퍼
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // 응답 본문을 텍스트로 먼저 읽기
    const text = await response.text();
    
    // Content-Type 확인
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API 응답이 JSON이 아닙니다:', {
        url,
        status: response.status,
        contentType,
        preview: text.substring(0, 200)
      });
      throw new Error(`API 응답이 JSON이 아닙니다. 서버 연결을 확인해주세요. (${response.status})`);
    }
    
    // JSON 파싱
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('응답 내용:', text.substring(0, 500));
      throw new Error('서버에서 올바른 JSON 응답을 받지 못했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    }

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 요청 실패');
    }

    if (!data.success) {
      throw new Error(data.error?.message || 'API 응답 실패');
    }

    return data.data as T;
  } catch (error) {
    console.error('API 요청 오류:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new Error('서버에서 올바른 JSON 응답을 받지 못했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
}

// 메뉴 API
export const menuApi = {
  /**
   * 모든 메뉴 조회
   */
  getAllMenus: async (): Promise<Menu[]> => {
    return request<Menu[]>('/menus');
  },

  /**
   * 특정 메뉴 조회
   */
  getMenuById: async (id: number): Promise<Menu> => {
    return request<Menu>(`/menus/${id}`);
  },

  /**
   * 재고 현황 조회 (관리자용)
   */
  getStockStatus: async (): Promise<Array<{
    id: number;
    name: string;
    stock_quantity: number;
    category?: string;
    is_available: boolean;
  }>> => {
    return request('/menus/stock');
  },

  /**
   * 재고 수정 (관리자용)
   */
  updateStock: async (menuId: number, stockQuantity: number): Promise<{
    id: number;
    name: string;
    stock_quantity: number;
  }> => {
    return request(`/menus/${menuId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock_quantity: stockQuantity }),
    });
  },
};

// 주문 API
export const orderApi = {
  /**
   * 주문 생성
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<{
    order_id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  }> => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * 주문 목록 조회
   */
  getAllOrders: async (filters?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<Order[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.page) queryParams.append('page', filters.page.toString());

    const queryString = queryParams.toString();
    return request<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * 특정 주문 조회
   */
  getOrderById: async (id: number): Promise<Order> => {
    return request<Order>(`/orders/${id}`);
  },

  /**
   * 주문 상태 변경
   */
  updateOrderStatus: async (orderId: number, status: string): Promise<{
    id: number;
    order_number: string;
    status: string;
    updated_at: string;
  }> => {
    return request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * 주문 통계 조회
   */
  getOrderStats: async (): Promise<OrderStats> => {
    return request<OrderStats>('/orders/stats');
  },
};

