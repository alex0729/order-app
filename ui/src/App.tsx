import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPage from './pages/AdminPage';
import { menuApi, orderApi } from './utils/api';
import type { Menu, Order, OrderItem } from './utils/api';
import type { Product, CartItem } from './types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'order' | 'admin'>('order');
  
  // 메뉴 관련 상태
  const [menus, setMenus] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 장바구니 상태
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // 관리자 페이지 상태
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<{[key: number]: number}>({});
  const [orderStats, setOrderStats] = useState({
    total_orders: 0,
    received_orders: 0,
    in_production_orders: 0,
    completed_orders: 0
  });

  // 메뉴 데이터 로드
  useEffect(() => {
    loadMenus();
  }, []);

  // 주문 및 재고 데이터 로드 (관리자 페이지)
  useEffect(() => {
    if (currentPage === 'admin') {
      loadOrders();
      loadInventory();
      loadOrderStats();
      
      // 주기적으로 새로고침 (5초마다)
      const interval = setInterval(() => {
        loadOrders();
        loadOrderStats();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  // 메뉴 로드 함수
  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const menuData = await menuApi.getAllMenus();
      
      // Menu 타입을 Product 타입으로 변환
      const products: Product[] = menuData.map((menu: Menu) => ({
        id: String(menu.id),
        name: menu.name,
        price: Number(menu.price),
        description: menu.description || '',
        imageUrl: menu.image_url,
        options: menu.options.map(opt => ({
          name: opt.name,
          price: Number(opt.price_modifier)
        }))
      }));
      
      setMenus(products);
    } catch (err) {
      console.error('메뉴 로드 오류:', err);
      setError(err instanceof Error ? err.message : '메뉴를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주문 로드 함수
  const loadOrders = async () => {
    try {
      const orderData = await orderApi.getAllOrders();
      setOrders(orderData);
    } catch (err) {
      console.error('주문 로드 오류:', err);
    }
  };

  // 재고 로드 함수
  const loadInventory = async () => {
    try {
      const stockData = await menuApi.getStockStatus();
      const inventoryMap: {[key: number]: number} = {};
      stockData.forEach(item => {
        inventoryMap[item.id] = item.stock_quantity;
      });
      setInventory(inventoryMap);
    } catch (err) {
      console.error('재고 로드 오류:', err);
    }
  };

  // 주문 통계 로드 함수
  const loadOrderStats = async () => {
    try {
      const stats = await orderApi.getOrderStats();
      setOrderStats(stats);
    } catch (err) {
      console.error('주문 통계 로드 오류:', err);
    }
  };

  // 장바구니에 상품 추가
  const addToCart = (product: Product, selectedOptions: Product['options']) => {
    // 옵션 가격 계산
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const totalPrice = product.price + optionsPrice;

    // 장바구니 아이템 생성
    const cartKey = `${product.id}-${selectedOptions.map(o => o.name).sort().join(',')}`;
    const existingItem = cartItems.find(
      item => `${item.productId}-${item.selectedOptions.map(o => o.name).sort().join(',')}` === cartKey
    );
    
    if (existingItem) {
      // 기존 아이템의 수량 증가
      setCartItems(cartItems.map(item =>
        `${item.productId}-${item.selectedOptions.map(o => o.name).sort().join(',')}` === cartKey
          ? { ...item, quantity: item.quantity + 1, totalPrice: (item.totalPrice / item.quantity) * (item.quantity + 1) }
          : item
      ));
    } else {
      // 새 아이템 추가
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        basePrice: product.price,
        selectedOptions: selectedOptions,
        quantity: 1,
        totalPrice: totalPrice
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  // 장바구니에서 아이템 제거
  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  // 주문하기
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    try {
      // 주문 데이터 생성
      const orderItems: OrderItem[] = cartItems.map(item => ({
        menu_id: parseInt(item.productId),
        quantity: item.quantity,
        selected_options: item.selectedOptions.map(opt => ({
          value: opt.name
        }))
      }));

      const orderData = {
        items: orderItems
      };

      await orderApi.createOrder(orderData);
      
      // 장바구니 비우기
    setCartItems([]);
    alert('주문이 완료되었습니다!');
      
      // 관리자 페이지면 주문 목록 새로고침
      if (currentPage === 'admin') {
        loadOrders();
        loadOrderStats();
      }
    } catch (err) {
      console.error('주문 생성 오류:', err);
      alert(err instanceof Error ? err.message : '주문 처리 중 오류가 발생했습니다.');
    }
  };

  // 주문 접수
  const receiveOrder = async (orderId: number) => {
    try {
      await orderApi.updateOrderStatus(orderId, '제조중');
      await loadOrders();
      await loadOrderStats();
    } catch (err) {
      console.error('주문 상태 변경 오류:', err);
      alert(err instanceof Error ? err.message : '주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 제조 시작
  const startProduction = async (orderId: number) => {
    try {
      await orderApi.updateOrderStatus(orderId, '제조중');
      await loadOrders();
      await loadOrderStats();
    } catch (err) {
      console.error('주문 상태 변경 오류:', err);
      alert(err instanceof Error ? err.message : '주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 제조 완료
  const completeOrder = async (orderId: number) => {
    try {
      await orderApi.updateOrderStatus(orderId, '완료');
      await loadOrders();
      await loadOrderStats();
    } catch (err) {
      console.error('주문 상태 변경 오류:', err);
      alert(err instanceof Error ? err.message : '주문 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 재고 업데이트
  const updateInventory = async (menuId: number, change: number) => {
    try {
      const currentStock = inventory[menuId] || 0;
      const newStock = Math.max(0, currentStock + change);
      
      await menuApi.updateStock(menuId, newStock);
      await loadInventory();
    } catch (err) {
      console.error('재고 업데이트 오류:', err);
      alert(err instanceof Error ? err.message : '재고 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="main-content">
        {currentPage === 'order' ? (
          <div className="order-page">
            {loading && <div className="loading">메뉴를 불러오는 중...</div>}
            {error && <div className="error">오류: {error}</div>}
            
            {!loading && !error && (
              <>
            <div className="products-grid">
                  {menus.map((menu) => (
              <ProductCard 
                      key={menu.id}
                      product={menu}
                onAddToCart={addToCart}
              />
                  ))}
                </div>
                
                <Cart
                  items={cartItems}
                  onRemoveItem={removeFromCart}
                  onUpdateQuantity={(productId, quantity) => {
                    if (quantity <= 0) {
                      removeFromCart(productId);
                    } else {
                      setCartItems(cartItems.map(item =>
                        item.productId === productId
                          ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
                          : item
                      ));
                    }
                  }}
                  onPlaceOrder={placeOrder}
                />
              </>
            )}
          </div>
        ) : (
          <AdminPage 
            orders={orders}
            inventory={inventory}
            menus={menus}
            orderStats={orderStats}
            onReceiveOrder={receiveOrder}
            onStartProduction={startProduction}
            onCompleteOrder={completeOrder}
            onUpdateInventory={updateInventory}
          />
        )}
      </main>
    </div>
  );
}

export default App;
