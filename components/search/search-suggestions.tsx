'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Tag } from 'lucide-react';
import { categories } from '@/lib/data';

interface SearchSuggestionsProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SearchSuggestions({ isVisible, onClose }: SearchSuggestionsProps) {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const popularSearches = [
    'bluetooth headphones',
    'cotton t-shirt',
    'fitness tracker',
    'smart speaker',
    'leather wallet'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Suggestions</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Popular searches */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <TrendingUp size={14} className="mr-1" />
            <span>Popular Searches</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {popularSearches.map((term) => (
              <Link 
                key={term} 
                href={`/search?q=${encodeURIComponent(term)}`}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={onClose}
              >
                <Search size={14} className="mr-2 text-gray-400" />
                <span>{term}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular categories */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Tag size={14} className="mr-1" />
            <span>Popular Categories</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.name.toLowerCase().replace(/ & /g, '-')}`}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100"
                onClick={onClose}
              >
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 