'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchSuggestions } from './search-suggestions';

interface SearchFormProps {
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
}

export function SearchForm({
  defaultValue = '',
  className = '',
  placeholder = 'Search for products...',
  size = 'md',
  autoFocus = false,
  showSuggestions = true,
  onSearch
}: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Only show suggestions if the input is focused and suggestions are enabled
    setShowSuggestionsPanel(isFocused && showSuggestions);
  }, [isFocused, showSuggestions]);

  const sizeClasses = {
    sm: 'py-1.5 pl-3 pr-8 text-sm rounded-full',
    md: 'py-2 pl-4 pr-10 rounded-full',
    lg: 'py-3 pl-4 pr-12 text-lg rounded-md'
  };

  const buttonSizeClasses = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-4'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setShowSuggestionsPanel(false);
  };

  return (
    <div className="relative">
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className={`relative ${className}`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`${sizeClasses[size]} w-full border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all`}
        />
        <button
          type="submit"
          className={`absolute ${buttonSizeClasses[size]} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground`}
        >
          <Search size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
        </button>
      </form>

      {showSuggestionsPanel && (
        <SearchSuggestions 
          isVisible={showSuggestionsPanel}
          onClose={() => setShowSuggestionsPanel(false)} 
        />
      )}
    </div>
  );
} 