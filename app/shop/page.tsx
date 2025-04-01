"use client";

import { useState, useEffect, Suspense, Fragment } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Filter, Grid2X2, List, X, ChevronDown, Sliders, SlidersHorizontal, Search, Check, ArrowUpDown, CreditCard } from "lucide-react";
import { products as productData, categories } from "@/lib/data";
import { Product } from "@/types";
import { Skeleton, BannerSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/product/product-grid";
import { RawImage } from "@/components/ui/raw-image";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Price range type
type PriceRange = {
  min: number;
  max: number;
};

// Sort options
type SortOption = 'price-low' | 'price-high' | 'newest' | 'name-asc' | 'name-desc';

// Loading state component
function ShopLoading() {
  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <BannerSkeleton />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="col-span-3">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </Container>
    </div>
  );
}

// Shop content component
function ShopContent() {
  // State for all products and filtered products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 500 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Get unique colors from products
  const availableColors = Array.from(
    new Set(
      allProducts
        .filter(product => product.colors)
        .flatMap(product => product.colors || [])
    )
  ).sort();

  // Get min and max price
  const minPrice = Math.min(...allProducts.map(product => product.price), 0);
  const maxPrice = Math.max(...allProducts.map(product => product.price), 500);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      
      // Simulate network delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAllProducts(productData);
      setFilteredProducts(productData);
      
      // Set initial price range based on product data
      const min = Math.floor(Math.min(...productData.map(p => p.price)));
      const max = Math.ceil(Math.max(...productData.map(p => p.price)));
      setPriceRange({ min, max });
      
      setIsLoading(false);
    }

    loadProducts();
  }, []);

  // Apply filters and sort
  useEffect(() => {
    let result = [...allProducts];
    
    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter(product => 
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Filter by stock
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        // For demo, we'll assume product ID correlates with recency
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, selectedCategories, selectedColors, priceRange, inStockOnly, searchQuery, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setPriceRange({ min: minPrice, max: maxPrice });
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Filter components
  const renderFilters = () => (
    <div className="space-y-6">
      {/* Search Box */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Search size={16} className="mr-2 text-primary" />
          Search
        </h3>
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pr-9 border-primary/20 focus-visible:ring-primary/30 rounded-md"
          />
          {searchQuery ? (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          )}
        </div>
      </div>
      
      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <SlidersHorizontal size={16} className="mr-2 text-primary" />
          Categories
        </h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2 pb-1">
          {categories.map(category => (
            <div 
              key={category.id} 
              className={`flex items-center rounded-md px-2 py-1.5 transition-colors ${
                selectedCategories.includes(category.name) 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-secondary/30 hover:bg-secondary/60'
              }`}
            >
              <Checkbox 
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  if (checked === true) {
                    setSelectedCategories([...selectedCategories, category.name]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(cat => cat !== category.name));
                  }
                }}
                className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <label htmlFor={`category-${category.id}`} className={`ml-2 text-sm cursor-pointer flex-grow ${selectedCategories.includes(category.name) ? 'font-medium text-primary' : ''}`}>
                {category.name}
              </label>
              {selectedCategories.includes(category.name) && (
                <Check size={16} className="text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <CreditCard size={16} className="mr-2 text-primary" />
          Price Range
        </h3>
        <div className="px-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">${priceRange.min}</span>
            <span className="text-sm font-medium">${priceRange.max}</span>
          </div>
          <Slider 
            defaultValue={[priceRange.min, priceRange.max]}
            min={minPrice}
            max={maxPrice}
            step={5}
            value={[priceRange.min, priceRange.max]}
            onValueChange={(value: number[]) => {
              setPriceRange({ min: value[0], max: value[1] });
            }}
            className="mb-6"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min ($)</label>
              <Input 
                type="number" 
                value={priceRange.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= minPrice && value <= priceRange.max) {
                    setPriceRange({ ...priceRange, min: value });
                  }
                }}
                className="h-8 border-primary/20 focus-visible:ring-primary/30 rounded-md text-center"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max ($)</label>
              <Input 
                type="number" 
                value={priceRange.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= priceRange.min && value <= maxPrice) {
                    setPriceRange({ ...priceRange, max: value });
                  }
                }}
                className="h-8 border-primary/20 focus-visible:ring-primary/30 rounded-md text-center"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <span className="mr-2 w-4 h-4 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full"></span>
            Colors
          </h3>
          <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
            {availableColors.map(color => (
              <div 
                key={color} 
                className={`flex items-center rounded-md px-2 py-1.5 transition-colors ${
                  selectedColors.includes(color) 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'bg-secondary/30 hover:bg-secondary/60'
                }`}
              >
                <Checkbox 
                  id={`color-${color}`}
                  checked={selectedColors.includes(color)}
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                    if (checked === true) {
                      setSelectedColors([...selectedColors, color]);
                    } else {
                      setSelectedColors(selectedColors.filter(c => c !== color));
                    }
                  }}
                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                />
                <div 
                  className="flex items-center ml-2 cursor-pointer flex-grow" 
                  onClick={() => {
                    const newColors = selectedColors.includes(color) 
                      ? selectedColors.filter(c => c !== color)
                      : [...selectedColors, color];
                    setSelectedColors(newColors);
                  }}
                >
                  <span 
                    className={`w-4 h-4 rounded-full mr-2 shadow-sm ${selectedColors.includes(color) ? 'ring-2 ring-primary ring-offset-1' : 'border'}`} 
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  <label 
                    htmlFor={`color-${color}`} 
                    className={`text-sm cursor-pointer ${selectedColors.includes(color) ? 'font-medium text-primary' : ''}`}
                  >
                    {color}
                  </label>
                </div>
                {selectedColors.includes(color) && (
                  <Check size={16} className="text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Stock Status */}
      <div>
        <div 
          className={`flex items-center rounded-md px-3 py-2.5 transition-colors ${
            inStockOnly 
              ? 'bg-primary/20 border border-primary/30'
              : 'bg-secondary/30 hover:bg-secondary/60'
          }`}
        >
          <Checkbox 
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked: boolean | "indeterminate") => setInStockOnly(checked === true)}
            className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
          <label htmlFor="in-stock" className={`ml-2 text-sm cursor-pointer flex-grow ${inStockOnly ? 'font-medium text-primary' : ''}`}>
            In Stock Only
          </label>
          {inStockOnly && (
            <Check size={16} className="text-primary" />
          )}
        </div>
      </div>
      
      {/* Clear filters */}
      <Button 
        variant="outline" 
        size="sm"
        className="w-full mt-4 border-primary/30 hover:bg-primary/10 transition-colors"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  // Mobile filter dialog
  const MobileFilter = () => (
    <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold text-center">Filter Products</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {renderFilters()}
        </div>
        <div className="flex gap-3 mt-6 border-t pt-4">
          <Button 
            variant="outline"
            className="flex-1 border-primary/30"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Sort dropdown
  const SortDropdown = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/80 hover:bg-white border-primary/30">
          <ArrowUpDown size={14} className="text-primary" />
          <span className="hidden md:inline font-medium">Sort By:</span> 
          <span className="font-medium">
            {sortBy === 'newest' && 'Newest'}
            {sortBy === 'price-low' && 'Price: Low to High'}
            {sortBy === 'price-high' && 'Price: High to Low'}
            {sortBy === 'name-asc' && 'Name: A to Z'}
            {sortBy === 'name-desc' && 'Name: Z to A'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 shadow-lg rounded-lg overflow-hidden border-primary/10" align="end">
        <div className="p-1">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'name-asc', label: 'Name: A to Z' },
            { value: 'name-desc', label: 'Name: Z to A' }
          ].map((option) => (
            <button
              key={option.value}
              className={`w-full text-left flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors ${
                sortBy === option.value ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSortBy(option.value as SortOption)}
            >
              {option.label}
              {sortBy === option.value && <Check size={16} />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="py-8">
      <Container>
        {/* Enhanced Hero Banner */}
        <div className="relative w-full rounded-xl overflow-hidden mb-10 h-[350px] shadow-lg">
          <RawImage
            src="/images/electronics-category.jpg"
            alt="Shop collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 flex flex-col justify-center px-8 md:px-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
              Our Collection
            </h1>   
            <p className="text-white/90 max-w-md mb-6 text-base md:text-lg animate-slideInLeft">
              Discover our carefully curated products selected for quality and style.
            </p>
            <Button className="bg-white text-black hover:bg-white/90 w-fit px-6 py-2 text-sm md:text-base animate-scaleIn">
              Explore Now
            </Button>
          </div>
        </div>

        {/* Shop Controls - with improved styling */}
        <div className="flex items-center justify-between mb-8 gap-3 flex-wrap bg-secondary/50 rounded-lg p-4 border border-border/50 shadow-sm">
          <div className="font-medium flex items-center gap-2">
            <span className="bg-primary/20 text-primary rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
              {filteredProducts.length}
            </span> 
            <span>{filteredProducts.length === 1 ? 'Product' : 'Products'} found</span>
          </div>
          <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
            <Button 
              variant="outline" 
              size="sm"
              className="md:hidden bg-white/80 hover:bg-white border-primary/30"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <Sliders size={14} className="mr-2 text-primary" />
              Filters
            </Button>
            
            <SortDropdown />
            
            <div className="hidden md:flex border-l pl-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                className={`${viewMode === 'grid' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/80 hover:bg-white'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${viewMode === 'list' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/80 hover:bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Active filters - improved visual design */}
        {(selectedCategories.length > 0 || selectedColors.length > 0 || inStockOnly || 
          searchQuery || priceRange.min > minPrice || priceRange.max < maxPrice) && (
          <div className="mb-8 flex flex-wrap gap-2 items-center p-4 bg-background border border-border/50 rounded-lg shadow-sm">
            <span className="text-sm font-medium mr-2 bg-secondary/50 px-3 py-1 rounded-full">Active Filters:</span>
            
            {selectedCategories.map(category => (
              <span 
                key={category}
                className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors"
              >
                {category}
                <button 
                  className="ml-2 bg-white/30 rounded-full p-0.5 hover:bg-white/60"
                  onClick={() => setSelectedCategories(selectedCategories.filter(cat => cat !== category))}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            
            {selectedColors.map(color => (
              <span 
                key={color}
                className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors"
              >
                <span 
                  className="w-3 h-3 rounded-full mr-2 border" 
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {color}
                <button 
                  className="ml-2 bg-white/30 rounded-full p-0.5 hover:bg-white/60"
                  onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            
            {(priceRange.min > minPrice || priceRange.max < maxPrice) && (
              <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors">
                ${priceRange.min} - ${priceRange.max}
                <button 
                  className="ml-2 bg-white/30 rounded-full p-0.5 hover:bg-white/60"
                  onClick={() => setPriceRange({ min: minPrice, max: maxPrice })}
                >
                  <X size={10} />
                </button>
              </span>
            )}
            
            {inStockOnly && (
              <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors">
                In Stock Only
                <button 
                  className="ml-2 bg-white/30 rounded-full p-0.5 hover:bg-white/60"
                  onClick={() => setInStockOnly(false)}
                >
                  <X size={10} />
                </button>
              </span>
            )}
            
            {searchQuery && (
              <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full flex items-center hover:bg-primary/20 transition-colors">
                "{searchQuery}"
                <button 
                  className="ml-2 bg-white/30 rounded-full p-0.5 hover:bg-white/60"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={10} />
                </button>
              </span>
            )}
            
            <button 
              className="text-xs text-primary hover:text-primary/80 font-medium ml-auto bg-white/80 px-3 py-1.5 rounded-full hover:bg-white transition-colors"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        )}
        
        {/* Main Content - improved layout and styling */}
        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop - enhanced styling */}
          <div className="hidden lg:block">
            <div className="border rounded-lg shadow-sm bg-white dark:bg-secondary/10 overflow-hidden sticky top-24">
              <div className="bg-secondary/50 border-b p-5 flex items-center justify-between">
                <h2 className="font-bold text-xl">Filters</h2>
                <SlidersHorizontal size={18} className="text-primary" />
              </div>
              <div className="p-5">
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                  {renderFilters()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Grid - with wrapper improvements */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <ProductGridSkeleton count={12} />
            ) : filteredProducts.length > 0 ? (
              <div className="bg-white dark:bg-secondary/10 rounded-lg border p-4 sm:p-6 shadow-sm">
                <ProductGrid 
                  products={filteredProducts} 
                  columns={viewMode === 'list' ? 2 : 3} 
                  isLoading={isLoading} 
                />
                
                {/* Pagination placeholder - improved styling */}
                {filteredProducts.length > 12 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled className="border-primary/30">Previous</Button>
                      <Button variant="outline" size="sm" className="bg-primary/20 border-primary/30 text-primary">1</Button>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 border-primary/30">2</Button>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 border-primary/30">3</Button>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 border-primary/30">Next</Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-secondary/10 rounded-lg border shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  We couldn't find any products matching your current filters. Try adjusting your filters or search criteria.
                </p>
                <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile filter dialog - improved styling will be in the component below */}
        <MobileFilter />
      </Container>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}
