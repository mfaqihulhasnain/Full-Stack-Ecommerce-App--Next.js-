import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getSaleProducts } from "@/lib/data";
import { Clock, Percent, Tag, TrendingDown } from "lucide-react";
import { SaleProductCard } from "@/components/product/sale-product-card";

export default function SalesPage() {
  const saleProducts = getSaleProducts();

  return (
    <div className="pb-12">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-black">
        <Image
          src="/images/clothing-category.jpg"
          alt="Sale Banner"
          fill
          className="object-cover opacity-60"
          priority
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Container>
            <div className="text-center text-white max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Summer <span className="text-yellow-400">SALE</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6">
                Up to 30% off on selected items
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="#sale-products">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Sale Features */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-3 rounded-full mb-4">
                <Percent className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Up to 30% Off</h3>
              <p className="text-gray-600">Big discounts on selected items across all categories</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Limited Time</h3>
              <p className="text-gray-600">Don't miss out on these limited-time offers</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Same high-quality products at reduced prices</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Price Match</h3>
              <p className="text-gray-600">Found it cheaper elsewhere? We'll match the price</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Sale Products */}
      <section id="sale-products" className="py-12">
        <Container>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sale Products</h2>
            <p className="text-gray-600">
              Don't miss these amazing deals on our top products. Limited stock available!
            </p>
          </div>

          {saleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <SaleProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No sale products available at the moment. Check back soon!</p>
            </div>
          )}
        </Container>
      </section>

      {/* Newsletter & Timer Section */}
      <section className="py-12 bg-gray-900 text-white">
        <Container>
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Get notified about upcoming sales
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about exclusive deals and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
} 