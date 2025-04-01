'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { CartItem } from "@/components/cart/cart-item";
import { formatCurrency } from "@/lib/utils";
import { 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Undo2, 
  CreditCard, 
  Package2, 
  Clock,
  CheckCircle2
} from "lucide-react";
import { SimpleImage } from "@/components/ui/simple-image";
import { getProductById } from "@/lib/data";
import Image from "next/image";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  
  // Initialize store hooks, but don't use them until mounted
  const store = useCartStore();
  
  useEffect(() => {
    setMounted(true);
    
    // This would be better as an API call in a real app
    const fetchSuggestedProducts = () => {
      // Get 4 random products for suggestions
      // Use a Set to ensure we don't have duplicate IDs
      const productIds = new Set<number>();
      while (productIds.size < 4) {
        const id = Math.floor(Math.random() * 20) + 1;
        productIds.add(id);
      }
      
      const suggestions = Array.from(productIds).map(id => 
        getProductById(id.toString())
      ).filter(Boolean);
      
      setSuggestedProducts(suggestions as any[]);
    };
    
    fetchSuggestedProducts();
  }, []);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "discount10") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code");
    }
  };

  if (!mounted) {
    return null;
  }

  // Once mounted, we can safely use the store
  const { items, getTotalItems, getTotalPrice, clearCart } = store;
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping - discount;
  
  // Calculate shipping threshold
  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = freeShippingThreshold - subtotal > 0 ? freeShippingThreshold - subtotal : 0;
  
  // Estimated delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border">
              <div className="text-center max-w-md px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">
                  Looks like you haven't added anything to your cart yet. 
                  Browse our collection and discover amazing products.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white">
                    Start Shopping
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
            
            {suggestedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6">You might like these</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {suggestedProducts.map((product, index) => (
                    <Link 
                      key={`empty-${product.id}-${index}`} 
                      href={`/products/${product.id}`}
                      className="group"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={(product.images && Array.isArray(product.images) && product.images.length > 0) 
                            ? product.images[0] 
                            : (product.image || "/placeholder.jpg")}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <h3 className="mt-3 text-sm font-medium">{product.name}</h3>
                      <p className="mt-1 text-sm font-semibold">{formatCurrency(product.price)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="py-12">
      <Container>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Shopping Cart</h1>
          <p className="text-gray-500 mb-8">Review your items and proceed to checkout</p>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="font-semibold text-lg">
                    Cart Items ({totalItems})
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => clearCart()}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
                
                {/* Free Shipping Progress */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-5 w-5 text-primary" />
                    {shipping === 0 ? (
                      <p className="text-sm text-gray-700 font-medium">
                        You've unlocked <span className="text-primary font-semibold">FREE SHIPPING!</span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700">
                        Add <span className="font-semibold">{formatCurrency(amountToFreeShipping)}</span> more to your cart for FREE shipping
                      </p>
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressToFreeShipping}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-6 border-t flex flex-wrap justify-between gap-4">
                  <Link href="/shop">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Undo2 size={16} />
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Link href="/checkout">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Product Policies */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Secure Payments</h3>
                    <p className="text-xs text-gray-500">All transactions are encrypted</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Package2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Easy Returns</h3>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Fast Shipping</h3>
                    <p className="text-xs text-gray-500">2-5 business days delivery</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={16} />
                        Discount (10%)
                      </span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                {/* Coupon code */}
                {!couponApplied ? (
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-2">Apply Coupon Code</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <Button 
                        onClick={applyCoupon}
                        disabled={!couponCode}
                        variant="outline"
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try "DISCOUNT10" for 10% off</p>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <p className="text-sm text-green-800">
                      Coupon code "DISCOUNT10" applied successfully!
                    </p>
                  </div>
                )}
                
                {/* Estimated delivery */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={18} className="text-primary" />
                    <p className="font-medium text-sm">Estimated Delivery</p>
                  </div>
                  <p className="text-sm text-gray-800">{formattedDeliveryDate}</p>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Proceed to Checkout
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <CreditCard size={16} className="text-gray-400" />
                  <p className="text-xs text-center text-gray-500">
                    Secure checkout with all major payment methods
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* You might also like */}
          {suggestedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-6">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {suggestedProducts.map((product, index) => (
                  <Link 
                    key={`suggestion-${product.id}-${index}`} 
                    href={`/products/${product.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={(product.images && Array.isArray(product.images) && product.images.length > 0) 
                          ? product.images[0] 
                          : (product.image || "/placeholder.jpg")}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(product.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
} 