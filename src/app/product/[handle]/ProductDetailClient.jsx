'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Share, Star, ZoomIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getRecommendedProducts } from '@/app/lib/helper/getDataById';

export default function ProductDetailClient({ product }) {
  useEffect(() => {
    console.log('ProductDetailClient mounted with product:', product);
  }, [product]);


  

  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node || null);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialOptions = {};
    product.options.forEach(option => {
      initialOptions[option.name] = option.values[0];
    });
    return initialOptions;
  });


  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();


  const handleOptionChange = (optionName, value) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionName]: value
    };
    setSelectedOptions(newSelectedOptions);

    const matchingVariant = product.variants.edges.find(({ node }) =>
      node.selectedOptions.every(option =>
        newSelectedOptions[option.name] === option.value
      )
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant && product) {
      addToCart(product, selectedVariant.id, quantity);
    }
  };

  const getDiscountPercentage = () => {
    if (selectedVariant?.compareAtPrice && selectedVariant?.price) {
      const original = parseFloat(selectedVariant.compareAtPrice.amount);
      const current = parseFloat(selectedVariant.price.amount);
      return Math.round(((original - current) / original) * 100);
    }
    return null;
  };

  const renderSizeOptions = (option) => (
    <div className="flex flex-wrap ">
      {option.values.map((value) => (
        <button
          key={value}
          onClick={() => handleOptionChange(option.name, value)}
          className={`px-4 py-2 border text-sm font-medium transition-colors ${selectedOptions[option.name] === value
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
        >
          {value}
        </button>
      ))}
    </div>
  );

  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;
  const discountPercentage = getDiscountPercentage();



  const parseRating = (rating) => {
    if (!rating) return { value: 0, scaleMax: 5 };

    try {
      const parsed = JSON.parse(rating);
      const value = parseFloat(parsed.value);
      const scaleMax = parseFloat(parsed.scale_max);
      return {
        value: isNaN(value) ? 0 : value,
        scaleMax: isNaN(scaleMax) ? 5 : scaleMax,
      };
    } catch (e) {
      return { value: 0, scaleMax: 5 };
    }
  };




  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          <div className="space-y-4">
            <div className="aspect-[4/5] w-full bg-gray-50 relative overflow-hidden">
              {product.images.edges[selectedImageIndex] && (
                <Image
                  src={product.images.edges[selectedImageIndex].node.url}
                  alt={product.images.edges[selectedImageIndex].node.altText || product.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              <span className="absolute top-2 left-4 w-10 h-10 flex text-sm items-center justify-start transition-colors">
                {product?.fit?.value}
              </span>
            </div>

            {product.images.edges.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.edges.map(({ node }, index) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-50 relative overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-black' : 'border-transparent'
                      }`}
                  >
                    <Image
                      src={node.url}
                      alt={node.altText || product.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 uppercase tracking-wide">
                  {product.title}
                </h1>
                {product.tags[3] != "not on sale" && (
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 uppercase">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">
                {product.filter_fit?.value || 'Fit information not available'}
              </p>

              <div className="flex items-center space-x-3">
                {compareAtPrice != currentPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    Rs {(compareAtPrice * 77.04).toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  Rs {(currentPrice * 77.04).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <span className="text-sm font-medium">🏆 EARN 744 PACKVIP POINTS</span>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                {product?.rating?.value && (() => {
                  const { value, scaleMax } = parseRating(product.rating.value);

                  return (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{value} / {scaleMax || 5}</span>
                    </div>
                  );
                })()}
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {product.options
                .filter(option => !option.name.toLowerCase().includes('color'))
                .map((option) => (
                  <div key={option.id}>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                      {option.name}
                    </h3>
                    {renderSizeOptions(option)}
                    {selectedOptions[option.name] && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedOptions[option.name]}
                      </p>
                    )}
                  </div>
                ))}

              {/* Size Guide */}

              {
                product.map
              }
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {product.model_info_text?.value || 'Model info not available'}
                </span>
                <span className="text-sm font-medium text-black hover:underline uppercase tracking-wide">
                  SIZE GUIDE
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedVariant?.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
            </div>

            {product.description && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                  Description
                </h3>
                <div
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Shop the Look */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gray-100 p-8 flex items-center justify-between">
                <div className="flex-1">
                  <button className="text-sm font-medium text-black hover:underline uppercase tracking-wide">
                    SHOP THE LOOK
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-white border border-gray-200 rounded overflow-hidden">
                    <img
                      src={product.images.edges[selectedImageIndex].node.url}
                      alt="White clothing items"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
