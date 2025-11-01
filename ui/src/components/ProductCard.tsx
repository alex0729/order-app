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

  // 이미지 경로 결정 및 정규화
  const getImagePath = () => {
    if (product.imageUrl) {
      // 이미지 경로 정규화
      let imagePath = product.imageUrl;
      
      // 상대 경로를 절대 경로로 변환
      if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        imagePath = '/' + imagePath;
      }
      
      // 데이터베이스 경로를 실제 파일 경로로 매핑
      const imageMap: { [key: string]: string } = {
        '/images/americano.jpg': '/images/americano-hot.jpg',
        '/images/americano-hot.jpg': '/images/americano-hot.jpg',
        '/images/americano-ice.jpg': '/images/americano-ice.jpg',
        '/images/latte.jpg': '/images/caffe-latte.jpg',
        '/images/caffe-latte.jpg': '/images/caffe-latte.jpg',
        '/images/cappuccino.jpg': '/images/caffe-latte.jpg', // 카푸치노 이미지가 없으므로 라떼 이미지 사용
      };
      
      // 매핑된 경로가 있으면 사용
      if (imageMap[imagePath]) {
        return imageMap[imagePath];
      }
      
      return imagePath;
    }
    
    // 기본 이미지 경로 (이미지 URL이 없는 경우)
    const name = product.name.toLowerCase();
    if (name.includes('ice') || name.includes('아이스')) {
      return '/ice-americano.svg';
    } else if (name.includes('hot') || name.includes('핫')) {
      return '/hot-americano.svg';
    } else if (name.includes('라떼') || name.includes('latte') || name.includes('카푸치노') || name.includes('cappuccino')) {
      return '/cafe-latte.svg';
    }
    return '/ice-americano.svg';
  };

  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const imagePath = getImagePath();
  
  // 이미지 경로가 변경되면 상태 초기화
  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
    
    // 타임아웃: 2초 후 로딩 상태 해제 (이미지가 로드되지 않아도 표시 시도)
    const timeout = setTimeout(() => {
      setImageLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [imagePath]);
  
  const handleImageError = () => {
    console.warn(`이미지 표시 실패: ${imagePath}`);
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="product-card">
      <div className="product-image" style={{ position: 'relative' }}>
        {imageLoading && !imageError && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            background: '#f0f0f0',
            color: '#999',
            fontSize: '0.9rem',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            로딩 중...
          </div>
        )}
        {!imageError ? (
          <img 
            src={imagePath} 
            alt={product.name} 
            className="coffee-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            background: '#f0f0f0',
            color: '#999',
            fontSize: '0.9rem'
          }}>
            이미지 없음
          </div>
        )}
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
