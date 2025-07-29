// src\app\components\ProductCard.jsx
'use client';


import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
     if (product.variants.edges.length > 0) {
      addToCart(product, product.variants.edges[0].node.id, 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const primaryImage = product.images.edges[0]?.node;
  const secondaryImage = product.images.edges[1]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  const getBadges = () => {
    const badges = [];
    if (product.title.toLowerCase().includes('new')) badges.push('NEW DROP');
    if (product.title.toLowerCase().includes('oversized')) badges.push('OVERSIZED FIT');
    return badges;
  };

  const badges = getBadges();

  return (
    <div 
      className="group relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.handle}`}>
        <div className="aspect-[3/4] w-full overflow-hidden bg-gray-50 relative">
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 z-10 space-y-1">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-white text-black text-xs font-medium px-2 py-1 uppercase tracking-wide"
                >
                  {badge} 
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-colors rounded-full"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Product Images */}
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              fill
              className={`object-cover transition-opacity duration-500 ${
                isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.title}
              fill
              className={`object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Quick Add Button - appears on hover */}
          <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors leading-tight">
            {product.title}
          </h3>
          <p className="text-sm font-semibold text-gray-900">
            ${price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;