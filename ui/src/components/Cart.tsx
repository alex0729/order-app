import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onPlaceOrder: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onUpdateQuantity, onPlaceOrder }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="cart">
      <h3 className="cart-title">장바구니</h3>
      
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-cart">장바구니가 비어있습니다.</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-info">
                <span className="item-name">
                  {item.productName}
                  {item.selectedOptions.length > 0 && (
                    <span className="item-options">
                      ({item.selectedOptions.map(opt => opt.name).join(', ')})
                    </span>
                  )}
                </span>
                <span className="item-quantity">X {item.quantity}</span>
              </div>
              <div className="item-price">{item.totalPrice.toLocaleString()}원</div>
            </div>
          ))
        )}
      </div>
      
      {items.length > 0 && (
        <div className="cart-footer">
          <div className="total-amount">
            총 금액 {totalAmount.toLocaleString()}원
          </div>
          <button className="order-button" onClick={onPlaceOrder}>
            주문하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
