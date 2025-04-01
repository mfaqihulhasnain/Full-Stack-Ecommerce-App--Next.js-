import { RawImage } from "@/components/ui/raw-image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, Grid3X3, Layers, ChevronRight, Search } from "lucide-react";

export const metadata = {
  title: "Categories - ShopEase",
  description: "Browse our product categories and find what you need.",
};

export default function CategoriesPage() {
  return (
    <div>
      {/* Hero section */}
      <div className="relative bg-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-70">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800/70 to-gray-700/90 z-10"></div>
          <div className="grid grid-cols-4 h-full w-full">
            {categories.slice(0, 4).map((category, index) => (
              <div key={index} className="relative h-full w-full">
                {category.image && (
                  <RawImage
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover h-full w-full opacity-90"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Container className="relative py-16 md:py-24 z-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Browse Our Categories</h1>
            <p className="text-lg text-white/90 mb-8">
              Find exactly what you're looking for by browsing our diverse range of categories.
            </p>
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full h-12 pl-4 pr-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute right-4 top-3.5 text-white/80" size={20} />
            </div>
          </div>
        </Container>
      </div>
      
      {/* Breadcrumbs */}
      <Container className="py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-800 font-medium">Categories</span>
        </div>
      </Container>

      <Container className="py-8">
        {/* Featured categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Categories</h2>
              <p className="text-gray-600 mt-2">Our most popular categories to explore</p>
            </div>
            <Link href="#all-categories">
              <Button variant="outline" className="hidden sm:flex items-center">
                View All Categories
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(cat => ['Clothing', 'Electronics', 'Home & Kitchen'].includes(cat.name)).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.name.toLowerCase().replace(/ & /g, "-")}`}
                className="group block relative h-80 rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.01]"
              >
                <RawImage
                  src={category.image || "/placeholder.jpg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                    {category.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <Button className="mt-3 w-full bg-white text-gray-900 hover:bg-gray-100 group">
                      <span>Explore</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All categories */}
        <div id="all-categories">
          <div className="flex items-center mb-8">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <Grid3X3 className="text-primary h-5 w-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">All Categories</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.name.toLowerCase().replace(/ & /g, "-")}`}
                className="group bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden">
                  <RawImage
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {category.name === "Home & Kitchen" && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <span className="text-primary text-sm font-medium flex items-center">
                      View Products
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Category benefits */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 border">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Why Shop by Category?</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Browsing by category makes your shopping experience more efficient and helps you discover products that best fit your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Search className="text-primary h-4 w-4" />
                </div>
                <h3 className="font-semibold">Focused Searching</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Find exactly what you need without sorting through unrelated products.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Layers className="text-blue-600 h-4 w-4" />
                </div>
                <h3 className="font-semibold">Discover New Items</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Explore related products you might not have considered before.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Grid3X3 className="text-green-600 h-4 w-4" />
                </div>
                <h3 className="font-semibold">Compare Products</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Easily compare features and prices of similar items within a category.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 