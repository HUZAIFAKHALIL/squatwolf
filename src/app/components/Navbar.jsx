'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'MEN', href: '/collections/gym-wear-men' },
  { label: 'WOMEN', href: '/collections/workout-clothes-women' },
  { label: 'ACCESSORIES', href: '/collections/accessories' },
  { label: 'SALE', href: '/collections/sale' },
//   { label: 'EXPLORE', href: '/explore' },
];

const rightLinks = [
  { label: 'HELP', href: '#' },
  { label: 'PACKVIP', href: '#' },
  { label: 'LOG IN / SIGN UP', href: '#' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, toggleCartDrawer } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
            </Link>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <button className="text-gray-900 hover:text-gray-600 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-6 text-xs font-medium uppercase tracking-wide">
              {rightLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button className="text-gray-900 hover:text-gray-600 transition-colors duration-200">
              <Heart className="w-5 h-5" />
            </button>

            <button
              onClick={toggleCartDrawer}
              className="relative text-gray-900 hover:text-gray-600 transition-colors duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 hover:text-gray-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-sm font-medium uppercase tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-3 mt-3">
                {rightLinks.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-900 hover:text-gray-600 block px-3 py-2 text-xs font-medium uppercase tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
