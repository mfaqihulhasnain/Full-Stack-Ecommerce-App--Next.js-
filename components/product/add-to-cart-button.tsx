'use client';

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { Product } from "@/types";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AddToCartButton({ 
  product, 
  size = 'lg', 
  className = 'w-full sm:w-auto flex gap-2 mt-4' 
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <Button 
      size={size} 
      className={className}
      onClick={handleAddToCart}
    >
      <ShoppingBag size={size === 'lg' ? 20 : 16} />
      Add to Cart
    </Button>
  );
} 