"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useCartStore } from "@/lib/store";
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  UserCircle2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const categories = {
    "Clothing": ["Men", "Women", "Kids", "Accessories"],
    "Electronics": ["Phones", "Laptops", "Tablets", "Wearables"],
    "Home & Kitchen": ["Living Room", "Kitchen", "Bedroom", "Bathroom"]
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md" 
          : "bg-white border-b"
      )}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-accent text-accent-foreground text-sm py-2">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Shop</span>
            <span>Ease</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-input focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                aria-label="Search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <button 
                className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                onClick={() => toggleCategory("Shop")}
              >
                Shop
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/shop" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    All Products
                  </Link>
                  <Link href="/shop/new" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    New Arrivals
                  </Link>
                  <Link href="/shop/featured" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    Featured Items
                  </Link>
                  <Link href="/shop/sale" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">
                    Sale
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button 
                className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
                onClick={() => toggleCategory("Categories")}
              >
                Categories
                <ChevronDown size={16} className="ml-1" />
              </button>
              <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {Object.entries(categories).map(([category, subcategories]) => (
                    <div key={category} className="group/item">
                      <div className="flex items-center justify-between px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                        <Link href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}`}>
                          {category}
                        </Link>
                        <ChevronDown size={14} className="group-hover/item:rotate-180 transition-transform" />
                      </div>
                      <div className="hidden group-hover/item:block pl-4">
                        {subcategories.map((subcat) => (
                          <Link 
                            key={subcat}
                            href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}/${subcat.toLowerCase()}`}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-secondary"
                          >
                            {subcat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              aria-label="My Account"
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
            >
              <UserCircle2 size={22} />
            </button>
            <button
              aria-label="Wishlist"
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
            >
              <Heart size={22} />
            </button>
            <Link
              href="/cart"
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors relative"
            >
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link
              href="/cart"
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors relative"
            >
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Search - Show below navbar */}
      <div className="block sm:hidden py-2 px-4 border-t">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 pl-4 pr-10 text-sm rounded-full border border-input focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            aria-label="Search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col">
            <Link
              href="/"
              className="px-6 py-3 border-b text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Shop Dropdown */}
            <div>
              <button
                onClick={() => toggleCategory("Shop")}
                className="w-full px-6 py-3 border-b flex justify-between items-center text-foreground hover:bg-secondary transition-colors"
              >
                Shop
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "transition-transform", 
                    activeCategory === "Shop" ? "rotate-180" : ""
                  )} 
                />
              </button>
              {activeCategory === "Shop" && (
                <div className="bg-secondary py-1">
                  <Link
                    href="/shop"
                    className="block px-10 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/shop/new"
                    className="block px-10 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/shop/featured"
                    className="block px-10 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Featured Items
                  </Link>
                  <Link
                    href="/shop/sale"
                    className="block px-10 py-2 text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sale
                  </Link>
                </div>
              )}
            </div>
            
            {/* Categories Dropdown */}
            <div>
              <button
                onClick={() => toggleCategory("Categories")}
                className="w-full px-6 py-3 border-b flex justify-between items-center text-foreground hover:bg-secondary transition-colors"
              >
                Categories
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "transition-transform", 
                    activeCategory === "Categories" ? "rotate-180" : ""
                  )} 
                />
              </button>
              {activeCategory === "Categories" && (
                <div className="bg-secondary">
                  {Object.entries(categories).map(([category, subcategories]) => (
                    <div key={category}>
                      <Link
                        href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}`}
                        className="block px-10 py-2 font-medium text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category}
                      </Link>
                      {subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}/${subcategory.toLowerCase()}`}
                          className="block px-14 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Link
              href="/contact"
              className="px-6 py-3 border-b text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="px-6 py-4 space-y-4 border-t">
              <div className="flex space-x-6">
                <Link
                  href="/account"
                  className="flex items-center text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle2 size={20} className="mr-2" />
                  Account
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={20} className="mr-2" />
                  Wishlist
                </Link>
              </div>
              
              <div className="pt-4 border-t text-sm space-y-2">
                <Link
                  href="/about"
                  className="block text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/help"
                  className="block text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help Center
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 