import React from 'react';
import { Order } from '../types';

interface AdminPageProps {
  orders: Order[];
  onReceiveOrder: (orderId: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ orders, onReceiveOrder }) => {
  const totalOrders = orders.length;
  const receivedOrders = orders.filter(order => order.status === 'received').length;
  const inProductionOrders = orders.filter(order => order.status === 'in_production').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

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
              <span>10개</span>
              <div className="stock-buttons">
                <button>+</button>
                <button>-</button>
              </div>
            </div>
          </div>
          <div className="inventory-card">
            <h3>아메리카노 (HOT)</h3>
            <div className="stock-control">
              <span>10개</span>
              <div className="stock-buttons">
                <button>+</button>
                <button>-</button>
              </div>
            </div>
          </div>
          <div className="inventory-card">
            <h3>카페라떼</h3>
            <div className="stock-control">
              <span>10개</span>
              <div className="stock-buttons">
                <button>+</button>
                <button>-</button>
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
                  {order.items.map(item => `${item.productName} x ${item.quantity}`).join(', ')}
                </span>
                <span className="order-price">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <button 
                className="receive-order-button"
                onClick={() => onReceiveOrder(order.id)}
              >
                주문 접수
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
