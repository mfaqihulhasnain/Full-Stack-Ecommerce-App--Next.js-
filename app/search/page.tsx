'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { searchProducts } from "@/lib/data";
import { Product } from "@/types";
import { SearchForm } from "@/components/search/search-form";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      const results = searchProducts(query);
      setSearchResults(results);
      setIsLoading(false);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="py-8 md:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
          
          {/* Search box */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchForm 
              defaultValue={query} 
              size="lg" 
              autoFocus
              onSearch={handleSearch} 
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : (
            <>
              {query ? (
                <p className="text-gray-600 mb-6">
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${query}"`
                    : `No results found for "${query}"`
                  }
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  Enter a search term to find products
                </p>
              )}

              {searchResults.length > 0 ? (
                <ProductGrid products={searchResults} />
              ) : query ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-xl font-medium mb-2">No products match your search</p>
                  <p className="text-gray-500 mb-6">Try a different search term or browse our categories</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </Container>
    </div>
  );
} 