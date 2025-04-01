'use client';

import { Product } from "@/types";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Dynamically import the product card with proper Next.js compatibility
const ProductCard = dynamic(
  () => import('./product-card').then(mod => mod.ProductCard),
  { 
    loading: () => null,
    ssr: true
  }
);

interface ProductGridOptimizedProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

export function ProductGridOptimized({ 
  products, 
  columns = 3,
  isLoading = false 
}: ProductGridOptimizedProps) {
  const [isClient, setIsClient] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  
  // Create classname based on columns
  const gridClassName = {
    2: "grid grid-cols-2 gap-4 md:gap-6",
    3: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6",
    4: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
  }[columns];

  // Progressive loading of products for better performance
  useEffect(() => {
    setIsClient(true);
    
    if (!isLoading && products.length > 0) {
      // First, show just the visible products (above the fold)
      const initialCount = Math.min(columns * 2, products.length);
      setVisibleProducts(products.slice(0, initialCount));
      
      // Then, load the rest after a short delay
      if (products.length > initialCount) {
        const timer = setTimeout(() => {
          setVisibleProducts(products);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, products, columns]);

  // Show skeleton while loading
  if (isLoading) {
    return <ProductGridSkeleton count={columns * 2} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  // Handle server-side rendering
  if (!isClient) {
    return <ProductGridSkeleton count={columns * 2} />;
  }

  return (
    <div className={cn(gridClassName)}>
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 