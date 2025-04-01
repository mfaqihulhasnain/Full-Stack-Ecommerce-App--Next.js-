import Image from "next/image";
import Link from "next/link";
import { Suspense } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts, getNewArrivals, categories } from "@/lib/data";
import { ArrowRight, Sparkles, ShoppingCart, Truck, CreditCard, Gift } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { SimpleImage } from "@/components/ui/simple-image";
import { RawImage } from "@/components/ui/raw-image";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const newArrivalsProducts = getNewArrivals().slice(0, 4); // Limit to 4 products

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative w-full h-[88vh] overflow-hidden">
        <RawImage
          src="/images/heroimage.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-soft hidden md:block"></div>
        <div className="absolute bottom-20 left-20 w-52 h-52 bg-yellow-500/20 rounded-full blur-3xl animate-pulse-soft hidden md:block"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center">
          <Container>
            <div className="max-w-xl text-white">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-4 animate-float">
                Special Launch Offer • Limited Time Only!
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 leading-[1.1]">
                <span className="block">Discover &amp; Shop</span>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Premium Products</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 max-w-lg leading-relaxed">
                Your one-stop destination for quality products with fast shipping and exceptional customer service.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm">
                    <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  </div>
                  <span className="text-xs md:text-sm">Free Returns</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm">
                    <Truck className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                  </div>
                  <span className="text-xs md:text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm">
                    <CreditCard className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                  </div>
                  <span className="text-xs md:text-sm">Secure Checkout</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Link href="/shop">
                  <Button 
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 text-sm sm:text-base rounded-lg shadow-lg group border border-blue-300/30"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute -inset-px bg-gradient-to-r from-blue-400 to-blue-300 opacity-30 group-hover:opacity-50 blur-sm transition-all duration-300 group-hover:blur-md"></span>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent group-hover:h-full group-hover:via-blue-200/30 transition-all duration-500"></span>
                    <span className="relative flex items-center z-10">
                      Shop Now
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button 
                    variant="outline" 
                    className="relative overflow-hidden border-white/70 text-white px-4 py-2.5 text-sm sm:text-base rounded-lg group backdrop-blur-sm"
                  >
                    <span className="absolute inset-0 w-0 bg-white/20 group-hover:w-full transition-all duration-300"></span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300 ease-in-out"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-[8] transition-all duration-700 ease-in-out"></span>
                    <span className="relative z-10 flex items-center">
                      Explore Categories
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm p-2 rounded-lg animate-float">
                <div className="text-white/90 text-xs">Sale ends in:</div>
                <div className="flex gap-1 sm:gap-2">
                  <div className="flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/90 rounded">
                    <span className="text-sm sm:text-base font-bold text-white">24</span>
                    <span className="text-white/80 text-[8px] sm:text-[10px]">Hours</span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/90 rounded">
                    <span className="text-sm sm:text-base font-bold text-white">45</span>
                    <span className="text-white/80 text-[8px] sm:text-[10px]">Mins</span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary/90 rounded">
                    <span className="text-sm sm:text-base font-bold text-white">18</span>
                    <span className="text-white/80 text-[8px] sm:text-[10px]">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link 
              href="/categories" 
              className="flex items-center text-sm font-medium hover:underline"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/categories/${category.name.toLowerCase().replace(/ & /g, '-')}`}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <RawImage
                  src={category.image || 'https://placehold.co/600x600/png'}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-white/80">{category.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
              <Sparkles className="h-6 w-6 ml-2 text-yellow-500" />
            </div>
            <Link 
              href="/new-arrivals" 
              className="flex items-center text-sm font-medium hover:underline"
            >
              View All New Arrivals
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          {newArrivalsProducts.length > 0 ? (
            <Suspense fallback={<ProductGridSkeleton count={4} />}>
              <ProductGrid products={newArrivalsProducts} columns={4} />
            </Suspense>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">New products coming soon!</p>
            </div>
          )}
        </Container>
      </section>

      {/* Clothing Category Highlight Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <RawImage
                  src="/images/clothing-category.jpg"
                  alt="Clothing Category"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore Our Clothing Collection</h2>
              <p className="text-gray-600 mb-6">
                Discover the latest trends in fashion with our carefully curated clothing collection. 
                From casual everyday wear to statement pieces, find your perfect style with us.
              </p>
              <Link href="/categories/clothing">
                <Button className="flex items-center gap-2">
                  Shop Clothing
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link 
              href="/featured-items" 
              className="flex items-center text-sm font-medium hover:underline"
            >
              View All Featured
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductGrid products={featuredProducts} columns={4} />
          </Suspense>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-black text-white">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-white/80">
                Get the latest updates, deals, and exclusive offers directly to your inbox.
              </p>
            </div>
            <div className="max-w-md w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Email address"
                />
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-white/60 mt-2">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
