import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, Linkedin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-secondary/80 to-secondary border-t">
      <div className="absolute left-0 right-0 h-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
      <Container className="relative">
        {/* Main Footer Content */}
        <div className="py-8 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
          {/* Company info */}
          <div className="col-span-2 md:col-span-1 relative">
            <div className="absolute -top-3 -left-2 w-12 h-12 rounded-full bg-primary/5 blur-xl"></div>
            <Link href="/" className="text-2xl font-bold tracking-tight inline-block mb-3 md:mb-4 relative">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Nova</span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Buy</span>
            </Link>
            <p className="text-muted-foreground text-sm md:text-base mb-4 md:mb-5">
              Your one-stop shop for all your needs. Quality products, fast delivery, and excellent customer service.
            </p>
            <div className="flex space-x-2 md:space-x-3">
              <a
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Youtube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="#"
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-muted-foreground hover:text-primary hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="relative">
            <h3 className="text-sm md:text-md font-bold mb-3 md:mb-5 inline-flex items-center">
              <span className="bg-primary/10 w-1.5 h-1.5 rounded-full mr-2"></span>
              Shop
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">All Products</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/categories/clothing" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Clothing</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/categories/electronics" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Electronics</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/categories/home-kitchen" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Home & Kitchen</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/categories/beauty" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Beauty</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-sm md:text-md font-bold mb-3 md:mb-5 inline-flex items-center">
              <span className="bg-primary/10 w-1.5 h-1.5 rounded-full mr-2"></span>
              Information
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">About Us</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Shipping Policy</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Returns & Exchanges</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Terms & Conditions</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center group">
                  <span className="group-hover:underline">Privacy Policy</span>
                  <ArrowRight className="ml-1.5 w-0 h-0 opacity-0 group-hover:w-3 group-hover:h-3 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm md:text-md font-bold mb-3 md:mb-5 inline-flex items-center">
              <span className="bg-primary/10 w-1.5 h-1.5 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li className="flex items-start group">
                <div className="flex items-center justify-center mt-0.5 mr-2 md:mr-3 w-5 h-5 rounded-full bg-primary/10">
                  <Mail className="text-primary" size={12} />
                </div>
                <a href="mailto:support@novabuy.com" className="text-muted-foreground group-hover:text-primary transition-colors">
                  support@novabuy.com
                </a>
              </li>
              <li className="flex items-start group">
                <div className="flex items-center justify-center mt-0.5 mr-2 md:mr-3 w-5 h-5 rounded-full bg-primary/10">
                  <Phone className="text-primary" size={12} />
                </div>
                <a href="tel:+12345678900" className="text-muted-foreground group-hover:text-primary transition-colors">
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-start group">
                <div className="flex items-center justify-center mt-0.5 mr-2 md:mr-3 w-5 h-5 rounded-full bg-primary/10">
                  <MapPin className="text-primary" size={12} />
                </div>
                <address className="text-muted-foreground not-italic">
                  123 Commerce Street<br />
                  Shopping District, NY 10001
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 md:py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>
          <p className="text-muted-foreground text-xs md:text-sm">
            &copy; {currentYear} NovaBuy. All rights reserved.
          </p>
          <div className="mt-3 md:mt-0">
            <ul className="flex space-x-4 md:space-x-6 text-xs md:text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors hover:underline">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
} 