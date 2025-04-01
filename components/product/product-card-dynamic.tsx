'use client';

import dynamic from 'next/dynamic';
import { ProductCardSkeleton } from '@/components/ui/skeleton';

// Dynamically import the ProductCard component with proper Next.js compatibility
export default dynamic(
  () => import('./product-card').then(mod => mod.ProductCard),
  {
    loading: () => <ProductCardSkeleton />,
    ssr: true
  }
); 