import React from 'react';
import type { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productKey: { index: number }) => void;
  onUpdateQuantity?: (args: { index: number; quantity: number }) => void;
  onPlaceOrder: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onUpdateQuantity, onPlaceOrder }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="cart">
      <div className="cart-items-section">
        <h3 className="cart-title">장바구니</h3>
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">장바구니가 비어있습니다.</p>
          ) : (
            items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="cart-item">
                <div className="item-info">
                  <span className="item-name">
                    {item.productName}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <span className="item-options">
                        ({item.selectedOptions.map(opt => opt.name).join(', ')})
                      </span>
                    )}
                  </span>
                  <div className="item-quantity-row">
                    {onUpdateQuantity && (
                      <div className="qty-controls">
                        <button
                          className="qty-button"
                          onClick={() => onUpdateQuantity({ index, quantity: Math.max(0, item.quantity - 1) })}
                          aria-label="decrease"
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-button"
                          onClick={() => onUpdateQuantity({ index, quantity: item.quantity + 1 })}
                          aria-label="increase"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="item-actions">
                  <div className="item-price">{item.totalPrice.toLocaleString()}원</div>
                  <button 
                    className="remove-button"
                    onClick={() => onRemoveItem({ index })}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="cart-summary-section">
        <div>
          <div className="cart-title" style={{ marginBottom: 0 }}>요약</div>
          <div className="total-amount">
            총 금액 {totalAmount.toLocaleString()}원
          </div>
        </div>
        <button className="order-button" onClick={onPlaceOrder} disabled={items.length === 0}>
          주문하기
        </button>
      </div>
    </div>
  );
};

export default Cart;
