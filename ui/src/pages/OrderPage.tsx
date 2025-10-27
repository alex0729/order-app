import React from 'react';
import { Product, CartItem } from '../types';

interface OrderPageProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product, selectedOptions: Product['options']) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onPlaceOrder: () => void;
}

const OrderPage: React.FC<OrderPageProps> = ({
  products,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onPlaceOrder
}) => {
  return (
    <div className="order-page">
      <h1>주문 페이지 테스트</h1>
      <p>상품 개수: {products.length}</p>
      <p>장바구니 아이템: {cartItems.length}</p>
      
      <div className="products-section">
        <h2>메뉴</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.price.toLocaleString()}원</p>
              <p>{product.description}</p>
              <button onClick={() => onAddToCart(product, [])}>
                담기
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="cart-section">
        <h3>장바구니</h3>
        {cartItems.length === 0 ? (
          <p>장바구니가 비어있습니다.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.productId}>
                {item.productName} - {item.totalPrice.toLocaleString()}원
              </div>
            ))}
            <button onClick={onPlaceOrder}>주문하기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
