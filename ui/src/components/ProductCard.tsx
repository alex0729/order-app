import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedOptions: Product['options']) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = React.useState<Product['options']>([]);

  const handleOptionChange = (option: Product['options'][0], checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter(opt => opt.name !== option.name));
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedOptions);
    setSelectedOptions([]); // 옵션 초기화
  };

  // 이미지 경로 결정
  const getImagePath = () => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    // 기본 이미지 경로
    const name = product.name.toLowerCase();
    if (name.includes('ice') || name.includes('아이스')) {
      return '/ice-americano.svg';
    } else if (name.includes('hot') || name.includes('핫')) {
      return '/hot-americano.svg';
    } else if (name.includes('라떼') || name.includes('latte')) {
      return '/cafe-latte.svg';
    }
    return '/ice-americano.svg';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={getImagePath()} alt={product.name} className="coffee-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
        <p className="product-description">{product.description}</p>
        
        {product.options && product.options.length > 0 && (
          <div className="product-options">
            {product.options.map((option, index) => (
              <label key={index} className="option-item">
                <input
                  type="checkbox"
                  checked={selectedOptions.some(opt => opt.name === option.name)}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                  className="option-checkbox"
                />
                <span className="option-text">
                  {option.name} ({option.price > 0 ? `+${option.price.toLocaleString()}원` : '+0원'})
                </span>
              </label>
            ))}
          </div>
        )}
        
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
