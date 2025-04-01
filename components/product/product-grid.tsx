import { Product } from "@/types";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

export function ProductGrid({ 
  products, 
  columns = 3,
  isLoading = false 
}: ProductGridProps) {
  // Create classname based on columns
  const gridClassName = {
    2: "grid grid-cols-2 gap-4 md:gap-6",
    3: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6",
    4: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
  }[columns];

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

  return (
    <div className={cn(gridClassName)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 