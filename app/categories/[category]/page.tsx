import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { getProductsByCategory, categories } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, ShoppingBag, ArrowUpDown, Grid, List } from "lucide-react";
import { RawImage } from "@/components/ui/raw-image";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  // Format the category name for display
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/-/g, " & ");

  // Find the category in our data
  const category = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - ShopEase`,
    description: category.description || `Browse our ${category.name} collection.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Format the category name for display
  const categoryName = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/-/g, " & ");

  // Get products by category
  const products = getProductsByCategory(categoryName);

  // Find the category in our data
  const category = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  // If category doesn't exist, return 404
  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-[30vh] md:h-[40vh] bg-gray-900 overflow-hidden">
        {category.image && (
          <RawImage
            src={category.image}
            alt={category.name}
            fill
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <Container className="relative h-full flex flex-col justify-end pb-8">
          <div className="text-white space-y-2 max-w-2xl mb-4">
            <h1 className="text-3xl md:text-5xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 text-lg">{category.description}</p>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-6 text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link href="/categories" className="hover:text-gray-800 transition-colors">Categories</Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-800 font-medium">{category.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Special promotional banner for Home & Kitchen category */}
          {category.name === "Home & Kitchen" && (
            <div className="w-full mb-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-sm border p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0 bg-amber-200 p-3 rounded-full">
                  <ShoppingBag className="w-8 h-8 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 text-amber-900">Spring Kitchen Sale!</h3>
                  <p className="text-amber-800">
                    Get up to 30% off on selected kitchen appliances and organization tools.
                    Use code <span className="font-medium">KITCHEN30</span> at checkout.
                  </p>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Shop Sale
                </Button>
              </div>
            </div>
          )}

          {/* Sidebar filters (on larger screens) */}
          <div className="hidden md:block w-64 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Filter size={18} className="mr-2 text-primary" />
                Filters
              </h3>
              
              <div className="space-y-5">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price-1" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="price-1" className="ml-2 text-sm">Under $50</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-2" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="price-2" className="ml-2 text-sm">$50 - $100</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-3" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="price-3" className="ml-2 text-sm">$100 - $200</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="price-4" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="price-4" className="ml-2 text-sm">$200 & Above</label>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-5">
                  <h4 className="font-medium mb-3">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="in-stock" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="in-stock" className="ml-2 text-sm">In Stock</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="on-sale" className="rounded text-primary focus:ring-primary" />
                      <label htmlFor="on-sale" className="ml-2 text-sm">On Sale</label>
                    </div>
                  </div>
                </div>

                {/* Home & Kitchen specific filters */}
                {category.name === "Home & Kitchen" && (
                  <>
                    <div className="border-t border-gray-200 pt-5">
                      <h4 className="font-medium mb-3">Kitchen Area</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="cookware" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="cookware" className="ml-2 text-sm">Cookware</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="appliances" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="appliances" className="ml-2 text-sm">Appliances</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="storage" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="storage" className="ml-2 text-sm">Storage & Organization</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="dining" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="dining" className="ml-2 text-sm">Dining & Serving</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-5">
                      <h4 className="font-medium mb-3">Material</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="stainless" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="stainless" className="ml-2 text-sm">Stainless Steel</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="glass" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="glass" className="ml-2 text-sm">Glass</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="ceramic" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="ceramic" className="ml-2 text-sm">Ceramic</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="wood" className="rounded text-primary focus:ring-primary" />
                          <label htmlFor="wood" className="ml-2 text-sm">Wood</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Apply Filters
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">Our customer service team is available to assist you with any questions.</p>
              <Button variant="outline" className="w-full">
                <ShoppingBag size={16} className="mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Mobile filters button */}
            <div className="md:hidden mb-4">
              <Button variant="outline" className="w-full mb-4 flex items-center justify-center">
                <Filter size={16} className="mr-2" />
                Show Filters
              </Button>
            </div>
            
            {/* Sorting and view options */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="mb-3 sm:mb-0">
                <p className="text-sm text-gray-500">Showing {products.length} products</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 mr-1">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Best Selling</option>
                </select>
                <div className="hidden md:flex border-l border-gray-300 pl-2 ml-2">
                  <button className="p-1.5 rounded hover:bg-gray-100 text-primary">
                    <Grid size={18} />
                  </button>
                  <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product grid */}
            {products.length > 0 ? (
              <>
                {/* Kitchen organization tips - only shown for Home & Kitchen category */}
                {category.name === "Home & Kitchen" && (
                  <div className="mb-8 p-5 bg-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-lg mb-3">Kitchen Organization Tips</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-2 mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium text-xs">1</span>
                        </div>
                        <p>Use drawer dividers for utensils and cooking tools to maximize space</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-2 mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium text-xs">2</span>
                        </div>
                        <p>Install hooks on cabinet doors for measuring cups and spoons</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-2 mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium text-xs">3</span>
                        </div>
                        <p>Use clear containers for pantry items to easily see when supplies are low</p>
                      </div>
                    </div>
                  </div>
                )}
                <ProductGrid products={products} columns={3} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any products in this category. Please check back later or try a different category.
                  </p>
                  <Link href="/categories">
                    <Button variant="outline">
                      Browse Categories
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 