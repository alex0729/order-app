import React from 'react';
import type { Order } from '../utils/api';
import type { Product } from '../types';

interface AdminPageProps {
  orders: Order[];
  inventory: {[key: number]: number};
  menus: Product[];
  orderStats: {
    total_orders: number;
    received_orders: number;
    in_production_orders: number;
    completed_orders: number;
  };
  onReceiveOrder: (orderId: number) => void;
  onStartProduction: (orderId: number) => void;
  onCompleteOrder: (orderId: number) => void;
  onUpdateInventory: (menuId: number, change: number) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  orders,
  inventory,
  menus,
  orderStats,
  onReceiveOrder,
  onStartProduction: _onStartProduction,
  onCompleteOrder,
  onUpdateInventory
}) => {
  // 주문 상태별 필터링된 주문
  const pendingOrders = orders.filter(order => order.status === '접수');
  const inProductionOrders = orders.filter(order => order.status === '제조중');
  
  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 주문 항목 표시
  const formatOrderItems = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      return '주문 항목 없음';
    }
    return order.items.map(item => {
      const menuName = item.menu_name || `메뉴 ID: ${item.menu_id}`;
      const quantity = item.quantity || 1;
      return `${menuName} x ${quantity}`;
    }).join(', ');
  };

  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        <h2>관리자 대시보드</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">총 주문</span>
            <span className="stat-value">{orderStats.total_orders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">주문 접수</span>
            <span className="stat-value">{orderStats.received_orders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">제조 중</span>
            <span className="stat-value">{orderStats.in_production_orders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">제조 완료</span>
            <span className="stat-value">{orderStats.completed_orders}</span>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <h2>재고 현황</h2>
        <div className="inventory-grid">
          {menus.map((menu) => {
            const menuId = parseInt(menu.id);
            const stock = inventory[menuId] || 0;
            
            return (
              <div key={menu.id} className="inventory-card">
                <h3>{menu.name}</h3>
                <div className="stock-control">
                  <div className="stock-info">
                    <span className="stock-count">{stock}개</span>
                    <span className={`stock-status ${stock === 0 ? 'out-of-stock' : stock < 5 ? 'low-stock' : 'in-stock'}`}>
                      {stock === 0 ? '품절' : stock < 5 ? '주의' : '정상'}
                    </span>
                  </div>
                  <div className="stock-buttons">
                    <button onClick={() => onUpdateInventory(menuId, 1)}>+</button>
                    <button onClick={() => onUpdateInventory(menuId, -1)}>-</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="orders-section">
        <h2>주문 현황</h2>
        <div className="orders-list">
          {pendingOrders.length === 0 && inProductionOrders.length === 0 ? (
            <p className="no-orders">진행 중인 주문이 없습니다.</p>
          ) : (
            <>
              {/* 접수된 주문 */}
              {pendingOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-time">{formatDateTime(order.order_datetime || order.created_at || '')}</span>
                    <span className="order-items">{formatOrderItems(order)}</span>
                    <span className="order-price">{Number(order.total_amount).toLocaleString()}원</span>
                  </div>
                  <button
                    className="receive-order-button"
                    onClick={() => onReceiveOrder(order.id)}
                  >
                    주문 접수
                  </button>
                </div>
              ))}

              {/* 제조 중인 주문 */}
              {inProductionOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-time">{formatDateTime(order.order_datetime || order.created_at || '')}</span>
                    <span className="order-items">{formatOrderItems(order)}</span>
                    <span className="order-price">{Number(order.total_amount).toLocaleString()}원</span>
                    <span className="order-status">제조 중</span>
                  </div>
                  <button
                    className="complete-order-button"
                    onClick={() => onCompleteOrder(order.id)}
                  >
                    제조 완료
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
