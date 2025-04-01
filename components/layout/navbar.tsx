"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { useCartStore } from "@/lib/store";
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  Heart, 
  UserCircle2,
  ChevronDown,
  Bell,
  ShoppingCart,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchForm } from "@/components/search/search-form";
import { useSearch } from "@/providers/search-provider";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuAnimation, setMenuAnimation] = useState<'entering' | 'leaving' | 'idle'>('idle');
  const { openSearch } = useSearch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a primitive selector
  const totalItems = useCartStore(
    state => mounted ? state.getTotalItems() : 0
  );

  // User auth state (fallback to demo mode if Clerk is disabled)
  const [demoIsSignedIn, setDemoIsSignedIn] = useState(false);
  
  // Create a ref for the profile dropdown
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  // Try to use Clerk's hook, but fall back to demo data if it fails
  let isSignedIn = false;
  let user: any = null;
  let clerkAuth: any = null;

  try {
    // This might throw an error if ClerkProvider is not available
    clerkAuth = useUser();
    isSignedIn = clerkAuth.isSignedIn || false;
    user = clerkAuth.user;
  } catch (error) {
    // Fallback to demo mode
    console.log("Using demo auth mode - ClerkProvider not available");
    isSignedIn = demoIsSignedIn;
    user = {
      fullName: "Demo User",
      primaryEmailAddress: { emailAddress: "demo@example.com" },
      imageUrl: null
    };
  }
  
  // Handle client-side effects
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setMenuAnimation('leaving');
      setTimeout(() => {
        setIsMenuOpen(false);
        setMenuAnimation('idle');
      }, 300); // Match duration with CSS animation
    } else {
      setIsMenuOpen(true);
      setMenuAnimation('entering');
      // When opening menu, reset active category
      setActiveCategory(null);
    }
  };

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const categories = {
    "Clothing": ["Men", "Women", "Kids", "Accessories"],
    "Electronics": ["Phones", "Laptops", "Tablets", "Wearables"],
    "Home & Kitchen": ["Living Room", "Kitchen", "Bedroom", "Bathroom"]
  };

  const closeMenu = () => {
    setMenuAnimation('leaving');
    setTimeout(() => {
      setIsMenuOpen(false);
      setMenuAnimation('idle');
      setActiveCategory(null);
    }, 300); // Match duration with CSS animation
  };

  // Add a function to toggle the profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Add these new functions to handle dropdown hover with delay
  const handleDropdownEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before hiding dropdown
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full",
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md" 
          : "bg-white"
      )}
    >
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
        <p className="font-medium">Free shipping on orders over $100 | <span className="underline cursor-pointer">Learn More</span></p>
      </div>

      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block border-b text-sm py-2">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/stores" className="hover:text-primary transition-colors">
                Find a Store
              </Link>
              <Link href="/track-order" className="hover:text-primary transition-colors">
                Track Order
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/help" className="hover:text-primary transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Container>
        <div className="flex items-center h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <div className="md:hidden mr-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold mr-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Nova</span>
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Buy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 h-full">
            <Link
              href="/"
              className="px-3 h-full flex items-center font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
            >
              Home
            </Link>
            <div 
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter('shop')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className={`flex items-center h-full px-3 font-medium hover:text-primary transition-colors border-b-2 border-transparent ${activeDropdown === 'shop' ? 'border-primary text-primary' : 'hover:border-primary'}`}
              >
                Shop
                <ChevronDown size={16} className={`ml-1 transition-transform ${activeDropdown === 'shop' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-1 p-4 w-64 rounded-md shadow-lg bg-white ring-1 ring-black/5 transition-all duration-200 z-50 ${activeDropdown === 'shop' ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="grid gap-2.5">
                  <Link href="/shop" className="group/item flex items-center text-foreground hover:text-primary transition-colors">
                    <span className="font-medium">All Products</span>
                    <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                  </Link>
                  <Link href="/new-arrivals" className="group/item flex items-center text-foreground hover:text-primary transition-colors">
                    <span className="font-medium">New Arrivals</span>
                    <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                  </Link>
                  <Link href="/featured-items" className="group/item flex items-center text-foreground hover:text-primary transition-colors">
                    <span className="font-medium">Featured Items</span>
                    <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                  </Link>
                  <Link href="/sales" className="group/item flex items-center text-foreground hover:text-primary transition-colors">
                    <span className="font-medium">Sale</span>
                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">HOT</span>
                    <span className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">→</span>
                  </Link>
                </div>
              </div>
            </div>
            <div 
              className="relative h-full" 
              onMouseEnter={() => handleDropdownEnter('categories')}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className={`flex items-center h-full px-3 font-medium hover:text-primary transition-colors border-b-2 border-transparent ${activeDropdown === 'categories' ? 'border-primary text-primary' : 'hover:border-primary'}`}
              >
                Categories
                <ChevronDown size={16} className={`ml-1 transition-transform ${activeDropdown === 'categories' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute left-0 mt-1 p-4 w-72 rounded-md shadow-lg bg-white ring-1 ring-black/5 transition-all duration-200 z-50 ${activeDropdown === 'categories' ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="grid gap-3">
                  {Object.entries(categories).map(([category, subcategories]) => (
                    <div key={category} className="group/category">
                      <Link 
                        href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}`}
                        className="block font-medium mb-1.5 text-foreground hover:text-primary transition-colors"
                      >
                        {category}
                      </Link>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 ml-2 text-sm">
                        {subcategories.map((subcat) => (
                          <Link 
                            key={subcat}
                            href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}/${subcat.toLowerCase()}`}
                            className="text-muted-foreground hover:text-primary transition-colors"
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
              className="px-3 h-full flex items-center font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
            >
              Contact
            </Link>
            {isSignedIn && (
              <Link
                href="/account/orders"
                className="px-3 h-full flex items-center font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
              >
                Orders
              </Link>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <SearchForm size="md" />
          </div>

          {/* Search Dialog Trigger - Tablet */}
          <div className="hidden md:flex lg:hidden ml-auto mr-4">
            <button
              onClick={openSearch}
              className="flex items-center text-sm px-3 py-1.5 rounded-full border hover:border-primary hover:text-primary transition-all"
            >
              <Search size={16} className="mr-1.5" />
              Search...
              <kbd className="ml-auto bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">⌘K</kbd>
            </button>
          </div>

          {/* Right Menu Items */}
          <div className="flex items-center ml-auto">
            <button
              onClick={openSearch}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={22} className="text-foreground" />
            </button>

            {/* Heart/Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-full hover:bg-muted transition-colors hidden md:block"
            >
              <Heart size={22} className="text-foreground" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-muted transition-colors relative"
            >
              <ShoppingBag size={22} className="text-foreground" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isSignedIn ? (
              <div className="relative ml-2 group">
                <button 
                  className="flex items-center gap-2 rounded-full hover:bg-muted transition-colors p-1"
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  {user?.imageUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={user.imageUrl} 
                        alt="User" 
                        className="w-full h-full object-cover"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProfileDropdown();
                        }}
                      />
                    </div>
                  ) : (
                    <UserCircle2 size={32} className="text-muted-foreground" />
                  )}
                </button>
                <div 
                  ref={profileDropdownRef}
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black/5 transition-all duration-200 z-50 ${
                    isProfileOpen ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                >
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/account" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <User size={16} />
                      <span>Account</span>
                    </Link>
                    <Link 
                      href="/account/orders" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <ShoppingCart size={16} />
                      <span>Orders</span>
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Bell size={16} />
                      <span>Notifications</span>
                    </Link>
                  </div>
                  <div className="border-t py-1">
                    <form method="post" action="/api/auth/signout">
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center ml-2 gap-2">
                {clerkAuth ? (
                  <>
                    <SignInButton>
                      <button className="text-sm font-medium hover:text-primary transition-colors">
                        Sign in
                      </button>
                    </SignInButton>
                    <span>/</span>
                    <SignUpButton>
                      <button className="text-sm font-medium hover:text-primary transition-colors">
                        Sign up
                      </button>
                    </SignUpButton>
                  </>
                ) : (
                  <button 
                    onClick={() => setDemoIsSignedIn(true)}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Demo Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Search - Show below navbar on small screens */}
      <div className="block sm:hidden px-4 py-2 border-t">
        <SearchForm size="sm" />
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 overflow-hidden" onClick={closeMenu}>
          <div 
            className={cn(
              "fixed inset-y-0 left-0 w-[85%] sm:w-80 h-full bg-white shadow-lg overflow-hidden transform-gpu",
              menuAnimation === 'entering' ? "animate-slide-in" : menuAnimation === 'leaving' ? "animate-slide-out" : ""
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-5 h-14 border-b sticky top-0 bg-white z-10">
                <Link href="/" className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Nova</span>
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Buy</span>
                </Link>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Mobile menu content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white">
                <nav className="flex flex-col">
                  <Link
                    href="/"
                    className="px-5 py-2.5 text-foreground hover:bg-blue-50/80 transition-colors border-l-4 border-transparent hover:border-primary"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                  
                  {/* Shop Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleCategory("Shop")}
                      className="w-full px-5 py-2.5 flex justify-between items-center text-foreground hover:bg-blue-50/80 transition-colors border-l-4 border-transparent hover:border-primary"
                    >
                      Shop
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform text-primary/70", 
                          activeCategory === "Shop" ? "rotate-180" : ""
                        )} 
                      />
                    </button>
                    {activeCategory === "Shop" && (
                      <div className="bg-blue-50/60 py-1">
                        <Link
                          href="/shop"
                          className="block px-10 py-2 text-foreground hover:bg-blue-100/50 transition-colors"
                          onClick={closeMenu}
                        >
                          All Products
                        </Link>
                        <Link
                          href="/new-arrivals"
                          className="block px-10 py-2 text-foreground hover:bg-blue-100/50 transition-colors"
                          onClick={closeMenu}
                        >
                          New Arrivals
                        </Link>
                        <Link
                          href="/featured-items"
                          className="block px-10 py-2 text-foreground hover:bg-blue-100/50 transition-colors"
                          onClick={closeMenu}
                        >
                          Featured Items
                        </Link>
                        <Link
                          href="/sales"
                          className="block px-10 py-2 text-foreground hover:bg-blue-100/50 transition-colors"
                          onClick={closeMenu}
                        >
                          <span className="flex items-center">
                            Sale
                            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">HOT</span>
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Categories Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleCategory("Categories")}
                      className="w-full px-5 py-2.5 flex justify-between items-center text-foreground hover:bg-blue-50/80 transition-colors border-l-4 border-transparent hover:border-primary"
                    >
                      Categories
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "transition-transform text-primary/70", 
                          activeCategory === "Categories" ? "rotate-180" : ""
                        )} 
                      />
                    </button>
                    {activeCategory === "Categories" && (
                      <div className="bg-blue-50/60">
                        {Object.entries(categories).map(([category, subcategories]) => (
                          <div key={category} className="mb-2">
                            <Link
                              href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}`}
                              className="block font-medium mb-1.5 text-foreground hover:text-primary transition-colors"
                            >
                              {category}
                            </Link>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 ml-2 text-sm">
                              {subcategories.map((subcat) => (
                                <Link 
                                  key={subcat}
                                  href={`/categories/${category.toLowerCase().replace(/ & /g, '-')}/${subcat.toLowerCase()}`}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {subcat}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Only show Orders link if signed in */}
                  {isSignedIn && (
                    <Link
                      href="/account/orders"
                      className="px-5 py-2.5 text-foreground hover:bg-blue-50/80 transition-colors border-l-4 border-transparent hover:border-primary flex items-center"
                      onClick={closeMenu}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Orders
                    </Link>
                  )}
                </nav>

                {/* Mobile menu footer */}
                <div className="border-t sticky bottom-0 bg-white">
                  <div className="px-5 pb-3 pt-2 mt-auto border-t">
                    {isSignedIn ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center mb-2">
                          {/* Show either Clerk's UserButton or a placeholder avatar */}
                          {user !== null && !('imageUrl' in user) ? (
                            <div className="ml-4 mr-2">
                              <UserButton afterSignOutUrl="/" />
                            </div>
                          ) : (
                            <UserCircle2 size={28} className="mr-3" />
                          )}
                          <div>
                            <p className="font-medium">{user?.fullName || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress || ""}</p>
                          </div>
                        </div>
                        <Link
                          href="/account"
                          className="w-full px-3 py-1.5 text-xs bg-primary/10 text-primary rounded border border-primary/20 flex items-center justify-center"
                          onClick={closeMenu}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="w-full px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 flex items-center justify-center"
                          onClick={closeMenu}
                        >
                          <ShoppingCart size={12} className="mr-1" />
                          My Orders
                        </Link>
                        {/* If in demo mode, show a demo sign out button */}
                        {user !== null && 'imageUrl' in user && !clerkAuth?.isSignedIn && (
                          <button
                            onClick={() => {
                              setDemoIsSignedIn(false);
                              closeMenu();
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded border border-red-100 flex items-center justify-center"
                          >
                            <LogOut size={12} className="mr-1" />
                            Sign Out (Demo)
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="hidden sm:flex items-center ml-2 gap-2">
                        {clerkAuth ? (
                          <>
                            <SignInButton>
                              <button className="text-sm font-medium hover:text-primary transition-colors">
                                Sign in
                              </button>
                            </SignInButton>
                            <span>/</span>
                            <SignUpButton>
                              <button className="text-sm font-medium hover:text-primary transition-colors">
                                Sign up
                              </button>
                            </SignUpButton>
                          </>
                        ) : (
                          <button 
                            onClick={() => setDemoIsSignedIn(true)}
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            Demo Sign In
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}