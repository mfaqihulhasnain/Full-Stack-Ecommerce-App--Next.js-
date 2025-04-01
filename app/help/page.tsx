'use client';

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Search, FileText, LifeBuoy, MessageCircle, ChevronRight, Mail, Phone, ShoppingBag, CreditCard, TruckIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  // Common questions categorized 
  const faqCategories = [
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Orders & Delivery",
      description: "Track your order, delivery options, and shipping information",
      questions: [
        "How do I track my order?",
        "What are the shipping options?",
        "How long will delivery take?",
        "Can I change my delivery address?",
      ],
      href: "/help/orders",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100",
      hoverColor: "group-hover:bg-blue-100"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Returns & Refunds",
      description: "Return policy, refund process, and exchange information",
      questions: [
        "How do I return an item?",
        "What's the return policy?",
        "How long do refunds take?",
        "Can I exchange for a different item?",
      ],
      href: "/help/returns",
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100",
      hoverColor: "group-hover:bg-amber-100"
    },
    {
      icon: <TruckIcon className="h-6 w-6" />,
      title: "Products & Inventory",
      description: "Product information, availability, and specifications",
      questions: [
        "When will an out-of-stock item be available?",
        "How can I be notified when an item is back in stock?",
        "Are your products authentic?",
        "Do you offer product warranties?",
      ],
      href: "/help/products",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-100",
      hoverColor: "group-hover:bg-green-100"
    },
  ];

  // All questions for search functionality
  const allQuestions = faqCategories.flatMap(category => 
    category.questions.map(question => ({
      question,
      category: category.title,
      href: category.href
    }))
  );

  // Filter questions based on search query
  const filteredQuestions = searchQuery 
    ? allQuestions.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
    
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already updating in real-time, this just prevents form submission
  };
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send the email to a backend
      console.log(`Subscribing email: ${email}`);
      setSubscribeSuccess(true);
      setTimeout(() => setSubscribeSuccess(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        {/* Hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="rounded-full bg-primary/10 text-primary inline-flex items-center px-4 py-2 mb-4">
            <LifeBuoy className="h-5 w-5 mr-2" />
            <span className="font-medium">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">How can we help you?</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find answers to common questions or contact our support team
          </p>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help with orders, returns, etc."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1 bg-primary hover:bg-primary/90 text-white rounded-full"
            >
              Search
            </Button>
          </form>
          
          {/* Search results */}
          {searchQuery && (
            <div className="mt-4 text-left max-w-xl mx-auto bg-white rounded-lg border shadow-sm">
              {filteredQuestions.length > 0 ? (
                <ul className="divide-y">
                  {filteredQuestions.map((item, index) => (
                    <li key={index} className="px-4 py-3 hover:bg-gray-50">
                      <Link href={item.href} className="block">
                        <p className="font-medium text-gray-900">{item.question}</p>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAQ Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {faqCategories.map((category, index) => (
            <div 
              key={index} 
              className="rounded-xl border bg-white shadow-sm group hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className={`${category.color} rounded-lg p-3 transition-colors ${category.hoverColor}`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-3 mb-6">
                  {category.questions.map((question, qIndex) => (
                    <li key={qIndex} className="flex items-start">
                      <ChevronRight className={`h-5 w-5 ${category.color.split(' ')[1]} shrink-0 mt-0.5`} />
                      <span className="text-gray-700 ml-2">{question}</span>
                    </li>
                  ))}
                </ul>
                <Link href={category.href}>
                  <Button variant="outline" className={`w-full border-2 ${category.borderColor} text-gray-700 hover:bg-gray-50`}>
                    View all FAQs
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Help Options */}
        <div className="rounded-2xl p-8 mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Still need help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-blue-100 transform transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4 transform transition-transform hover:rotate-12">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-500 mb-4">Chat with our support team in real-time</p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                onClick={() => setShowChatModal(true)}
              >
                Start a Chat
              </Button>
              <p className="text-sm text-gray-500 mt-4">Available 9AM - 8PM Mon-Fri</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-amber-100 transform transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 text-amber-600 mb-4 transform transition-transform hover:rotate-12">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-500 mb-4">Send us a message and we'll get back to you</p>
              <Link href="/contact">
                <Button variant="outline" className="w-full border-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                  Contact Us
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">Response within 24 hours</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-green-100 transform transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-50 text-green-600 mb-4 transform transition-transform hover:rotate-12">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-500 mb-4">Call us directly for immediate assistance</p>
              <a href="tel:+18001234567">
                <Button variant="outline" className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50">
                  +1 (800) 123-4567
                </Button>
              </a>
              <p className="text-sm text-gray-500 mt-4">Available 9AM - 6PM Mon-Fri</p>
            </div>
          </div>
        </div>

        {/* Quick Resources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 text-transparent bg-clip-text">Quick Resources</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/shipping">
              <div className="border rounded-lg p-4 flex items-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Shipping Policy</span>
              </div>
            </Link>
            <Link href="/returns">
              <div className="border rounded-lg p-4 flex items-center hover:bg-amber-50 hover:border-amber-200 transition-colors">
                <div className="bg-amber-100 rounded-lg p-2 mr-3">
                  <ArrowLeft className="h-5 w-5 text-amber-600" />
                </div>
                <span className="font-medium">Returns & Refunds</span>
              </div>
            </Link>
            <Link href="/faq">
              <div className="border rounded-lg p-4 flex items-center hover:bg-green-50 hover:border-green-200 transition-colors">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Full FAQ</span>
              </div>
            </Link>
            <Link href="/privacy">
              <div className="border rounded-lg p-4 flex items-center hover:bg-purple-50 hover:border-purple-200 transition-colors">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <LifeBuoy className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium">Privacy Policy</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Center Updates */}
        <div className="rounded-xl p-8 text-center bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 border border-gray-200">
          <h2 className="text-2xl font-bold mb-2">Help Center Updates</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay informed about new features, updated policies, and improvements to our help center.
          </p>
          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-primary focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
            >
              Subscribe
            </Button>
          </form>
          {subscribeSuccess && (
            <p className="text-green-600 mt-3 text-sm">
              Thank you for subscribing! You'll receive updates soon.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </Container>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[80vh] flex flex-col transform transition-all animate-fadeIn">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
              <h3 className="font-semibold flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Support
              </h3>
              <button 
                onClick={() => setShowChatModal(false)}
                className="text-white hover:text-gray-200 bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-start animate-slideInLeft">
                <div className="bg-blue-100 rounded-full p-2 mr-2 border border-blue-200">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] border border-gray-200">
                  <p className="text-sm">Hello! How can I help you today?</p>
                </div>
              </div>
              <div className="flex items-start justify-end animate-slideInRight">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%] border border-blue-600">
                  <p className="text-sm">This is a demo chat interface. In a real application, you would be able to send messages to a support agent.</p>
                </div>
              </div>
              <div className="flex items-start animate-slideInLeft">
                <div className="bg-blue-100 rounded-full p-2 mr-2 border border-blue-200">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] border border-gray-200">
                  <p className="text-sm">Of course! I understand this is a demo. Is there anything specific you'd like to know about our help center?</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <form className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button className="rounded-l-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 