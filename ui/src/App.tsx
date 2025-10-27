import React, { useState } from 'react';
import Header from './components/Header';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'order' | 'admin'>('order');
  const [cartItems, setCartItems] = useState<Array<{id: string, name: string, price: number, quantity: number, options: string[]}>>([]);
  const [orders, setOrders] = useState<Array<{id: string, timestamp: string, items: any[], totalAmount: number, status: string}>>([]);
  const [inventory, setInventory] = useState<{[key: string]: number}>({
    '아메리카노(ICE)': 10,
    '아메리카노(HOT)': 10,
    '카페라떼': 10
  });

  const addToCart = (id: string, name: string, price: number, options: string[]) => {
    const cartKey = `${id}-${options.join(',')}`;
    const existingItem = cartItems.find(item => `${item.id}-${item.options.join(',')}` === cartKey);
    
    // 옵션 가격 계산
    const optionPrices: { [key: string]: number } = {
      '샷 추가': 500,
      '시럽 추가': 0
    };
    const optionsPrice = options.reduce((sum, option) => sum + (optionPrices[option] || 0), 0);
    const totalPrice = price + optionsPrice;
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        `${item.id}-${item.options.join(',')}` === cartKey 
          ? { ...item, quantity: item.quantity + 1, price: totalPrice } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { id, name, price: totalPrice, quantity: 1, options }]);
    }
  };

  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ko-KR'),
      items: [...cartItems],
      totalAmount,
      status: 'pending'
    };
    
    setOrders([...orders, newOrder]);
    setCartItems([]);
    alert('주문이 완료되었습니다!');
  };

  const receiveOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'received' }
        : order
    ));
  };

  const startProduction = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'in_production' }
        : order
    ));
  };

  const completeOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'completed' }
        : order
    ));
  };

  const updateInventory = (item: string, change: number) => {
    setInventory(prev => ({
      ...prev,
      [item]: Math.max(0, prev[item] + change)
    }));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="main-content">
        {currentPage === 'order' ? (
          <div>
            <h1>주문 페이지</h1>
            <p>간단한 주문 페이지입니다.</p>
            <div className="products-grid">
              <ProductCard 
                id="1"
                name="아메리카노(ICE)"
                price={4000}
                description="깔끔하고 시원한 아이스 아메리카노"
                onAddToCart={addToCart}
              />
              <ProductCard 
                id="2"
                name="아메리카노(HOT)"
                price={4000}
                description="따뜻하고 진한 핫 아메리카노"
                onAddToCart={addToCart}
              />
              <ProductCard 
                id="3"
                name="카페라떼"
                price={5000}
                description="부드러운 우유와 에스프레소의 조화"
                onAddToCart={addToCart}
              />
            </div>
            
                <div className="cart-section">
                  <h3>장바구니</h3>
                  {cartItems.length === 0 ? (
                    <div className="cart">
                      <div className="cart-items-section">
                        <p>장바구니가 비어있습니다.</p>
                      </div>
                      <div className="cart-summary-section">
                        <div className="total-amount">0원</div>
                        <button className="order-button" disabled>주문하기</button>
                      </div>
                    </div>
                  ) : (
                    <div className="cart">
                      <div className="cart-items-section">
                        {cartItems.map((item, index) => (
                          <div key={index} className="cart-item">
                            <div className="item-info">
                              <div className="item-name">{item.name}</div>
                              {item.options.length > 0 && (
                                <div className="item-options">({item.options.join(', ')})</div>
                              )}
                              <div className="item-quantity">수량: {item.quantity}개</div>
                            </div>
                            <div className="item-price">
                              {(item.price * item.quantity).toLocaleString()}원
                            </div>
                            <button 
                              onClick={() => removeFromCart(index)}
                              style={{
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-summary-section">
                        <div className="total-amount">
                          총 금액: {totalAmount.toLocaleString()}원
                        </div>
                        <button className="order-button" onClick={placeOrder}>
                          주문하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
          </div>
        ) : (
          <AdminPage 
            orders={orders}
            inventory={inventory}
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

// AdminPage 컴포넌트
function AdminPage({ orders, inventory, onReceiveOrder, onStartProduction, onCompleteOrder, onUpdateInventory }: {
  orders: Array<{id: string, timestamp: string, items: any[], totalAmount: number, status: string}>;
  inventory: {[key: string]: number};
  onReceiveOrder: (orderId: string) => void;
  onStartProduction: (orderId: string) => void;
  onCompleteOrder: (orderId: string) => void;
  onUpdateInventory: (item: string, change: number) => void;
}) {
  const totalOrders = orders.length;
  const receivedOrders = orders.filter(order => order.status === 'received').length;
  const inProductionOrders = orders.filter(order => order.status === 'in_production').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  // 재고 상태를 반환하는 함수
  const getStockStatus = (count: number) => {
    if (count === 0) return { text: '품절', color: '#ef4444' };
    if (count < 5) return { text: '주의', color: '#f59e0b' };
    return { text: '정상', color: '#10b981' };
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <h2>관리자 대시보드</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">총 주문</span>
            <span className="stat-value">{totalOrders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">주문 접수</span>
            <span className="stat-value">{receivedOrders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">제조 중</span>
            <span className="stat-value">{inProductionOrders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">제조 완료</span>
            <span className="stat-value">{completedOrders}</span>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <h2>재고 현황</h2>
        <div className="inventory-grid">
          <div className="inventory-card">
            <h3>아메리카노 (ICE)</h3>
            <div className="stock-control">
              <div className="stock-info">
                <span className="stock-count">{inventory['아메리카노(ICE)']}개</span>
                <span className="stock-status" style={{ color: getStockStatus(inventory['아메리카노(ICE)']).color }}>
                  {getStockStatus(inventory['아메리카노(ICE)']).text}
                </span>
              </div>
              <div className="stock-buttons">
                <button onClick={() => onUpdateInventory('아메리카노(ICE)', 1)}>+</button>
                <button onClick={() => onUpdateInventory('아메리카노(ICE)', -1)}>-</button>
              </div>
            </div>
          </div>
          <div className="inventory-card">
            <h3>아메리카노 (HOT)</h3>
            <div className="stock-control">
              <div className="stock-info">
                <span className="stock-count">{inventory['아메리카노(HOT)']}개</span>
                <span className="stock-status" style={{ color: getStockStatus(inventory['아메리카노(HOT)']).color }}>
                  {getStockStatus(inventory['아메리카노(HOT)']).text}
                </span>
              </div>
              <div className="stock-buttons">
                <button onClick={() => onUpdateInventory('아메리카노(HOT)', 1)}>+</button>
                <button onClick={() => onUpdateInventory('아메리카노(HOT)', -1)}>-</button>
              </div>
            </div>
          </div>
          <div className="inventory-card">
            <h3>카페라떼</h3>
            <div className="stock-control">
              <div className="stock-info">
                <span className="stock-count">{inventory['카페라떼']}개</span>
                <span className="stock-status" style={{ color: getStockStatus(inventory['카페라떼']).color }}>
                  {getStockStatus(inventory['카페라떼']).text}
                </span>
              </div>
              <div className="stock-buttons">
                <button onClick={() => onUpdateInventory('카페라떼', 1)}>+</button>
                <button onClick={() => onUpdateInventory('카페라떼', -1)}>-</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-section">
        <h2>주문 현황</h2>
        <div className="orders-list">
          {orders.filter(order => order.status === 'pending').map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <span className="order-time">{order.timestamp}</span>
                <span className="order-items">
                  {order.items.map((item: any) => `${item.name} x ${item.quantity}`).join(', ')}
                </span>
                <span className="order-price">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <button 
                className="order-action-button"
                onClick={() => onReceiveOrder(order.id)}
              >
                주문 접수
              </button>
            </div>
          ))}
          {orders.filter(order => order.status === 'received').map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <span className="order-time">{order.timestamp}</span>
                <span className="order-items">
                  {order.items.map((item: any) => `${item.name} x ${item.quantity}`).join(', ')}
                </span>
                <span className="order-price">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <button 
                className="order-action-button"
                onClick={() => onStartProduction(order.id)}
              >
                제조 시작
              </button>
            </div>
          ))}
          {orders.filter(order => order.status === 'in_production').map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <span className="order-time">{order.timestamp}</span>
                <span className="order-items">
                  {order.items.map((item: any) => `${item.name} x ${item.quantity}`).join(', ')}
                </span>
                <span className="order-price">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <button 
                className="order-action-button"
                onClick={() => onCompleteOrder(order.id)}
              >
                제조 완료
              </button>
            </div>
          ))}
          {orders.filter(order => ['pending', 'received', 'in_production'].includes(order.status)).length === 0 && (
            <p>진행 중인 주문이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ProductCard 컴포넌트
function ProductCard({ id, name, price, description, onAddToCart }: {
  id: string;
  name: string;
  price: number;
  description: string;
  onAddToCart: (id: string, name: string, price: number, options: string[]) => void;
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter(opt => opt !== option));
    }
  };

  const handleAddToCart = () => {
    onAddToCart(id, name, price, selectedOptions);
    setSelectedOptions([]); // 옵션 초기화
  };

  // 이미지 경로 결정
  const getImagePath = () => {
    switch (name) {
      case '아메리카노(ICE)':
        return '/ice-americano.svg';
      case '아메리카노(HOT)':
        return '/hot-americano.svg';
      case '카페라떼':
        return '/cafe-latte.svg';
      default:
        return '/ice-americano.svg';
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={getImagePath()} alt={name} className="coffee-image" />
      </div>
      <h3>{name}</h3>
      <p>{price.toLocaleString()}원</p>
      <p>{description}</p>
      
      <div className="product-options">
        <label className="option-item">
          <input
            type="checkbox"
            checked={selectedOptions.includes('샷 추가')}
            onChange={(e) => handleOptionChange('샷 추가', e.target.checked)}
          />
          <span>샷 추가 (+500원)</span>
        </label>
        <label className="option-item">
          <input
            type="checkbox"
            checked={selectedOptions.includes('시럽 추가')}
            onChange={(e) => handleOptionChange('시럽 추가', e.target.checked)}
          />
          <span>시럽 추가 (+0원)</span>
        </label>
      </div>
      
      <button onClick={handleAddToCart}>담기</button>
    </div>
  );
}

export default App;