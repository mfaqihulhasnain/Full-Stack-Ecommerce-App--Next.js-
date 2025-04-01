'use client';

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { CartItem as CartItemType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      {/* Product image */}
      <Link href={`/products/${item.productId}`} className="block relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50 hover:opacity-90 transition-opacity">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 112px"
          unoptimized
        />
      </Link>

      {/* Product details */}
      <div className="flex flex-1 flex-col w-full sm:w-auto">
        <div className="flex justify-between w-full mb-1">
          <Link
            href={`/products/${item.productId}`}
            className="text-base font-medium text-gray-900 hover:text-primary transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-base font-semibold text-gray-900 ml-4">
            {formatCurrency(item.price)}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {item.size && <p className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</p>}
          {item.color && <p className="bg-gray-100 px-2 py-0.5 rounded">Color: {item.color}</p>}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Quantity controls */}
          <div className="flex items-center h-9 border rounded-lg overflow-hidden">
            <button
              onClick={decreaseQuantity}
              disabled={item.quantity <= 1}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-medium">{item.quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove button */}
          <Button
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="h-9 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={16} className="mr-1.5" />
            Remove
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-sm">
          <p className="text-gray-500">Item price: {formatCurrency(item.price)}</p>
          {item.quantity > 1 && (
            <p className="font-medium">
              Subtotal: {formatCurrency(item.price * item.quantity)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 