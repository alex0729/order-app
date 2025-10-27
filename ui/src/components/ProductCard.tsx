import React from 'react';
import { Product } from '../types';

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

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="image-placeholder">이미지</div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
        <p className="product-description">{product.description}</p>
        
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
        
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
