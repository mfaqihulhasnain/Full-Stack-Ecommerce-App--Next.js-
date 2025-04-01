'use client';

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RawImage } from "@/components/ui/raw-image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  // Determine if the image path is external or local
  const imageSrc = product.images[0]?.startsWith('http') 
    ? product.images[0] 
    : product.images[0] || 'https://placehold.co/600x600/png';

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg group border-transparent hover:border-primary/10 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <RawImage
            src={imageSrc}
            alt={product.name}
            fill
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div 
            className={cn(
              "absolute bottom-0 inset-x-0 flex justify-center pb-4 transition-transform duration-300",
              isHovering ? "translate-y-0" : "translate-y-full",
              "md:block hidden" // Only show on desktop
            )}
          >
            <Button
              size="sm"
              variant="default"
              onClick={handleAddToCart}
              className="bg-primary/90 hover:bg-primary backdrop-blur-sm rounded-full shadow-lg transition-all"
            >
              <ShoppingCart size={14} className="mr-1.5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="pt-4 p-3 sm:p-4">
        <div className="mb-1.5">
          <Link 
            href={`/categories/${product.category.toLowerCase().replace(/ & /g, '-')}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
        </div>
        <Link href={`/products/${product.id}`} className="block group">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0 p-3 sm:p-4">
        <div className="text-base sm:text-lg font-semibold text-foreground">
          {formatCurrency(product.price)}
        </div>
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/60 hover:bg-primary/10 transition-colors group/btn"
          aria-label="Add to cart"
        >
          <Plus size={16} className="text-muted-foreground group-hover/btn:text-primary transition-colors" />
        </button>
      </CardFooter>
    </Card>
  );
} 