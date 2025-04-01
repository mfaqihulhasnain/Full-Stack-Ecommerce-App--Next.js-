'use client';

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingBag, Search } from "lucide-react";

export default function OrdersHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // FAQ data structure
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once your order has been shipped, you'll receive a confirmation email with a tracking number. You can click on the tracking number in the email or go to your account's order history and click on 'Track Order'. This will show you the current status and location of your package."
    },
    {
      question: "What are the shipping options?",
      answer: "We offer several shipping options: Standard Shipping (3-5 business days), Express Shipping (2-3 business days), and Next Day Delivery (order by 2pm for delivery next business day). Shipping costs vary based on your location and the selected shipping method. You can view all available options during checkout."
    },
    {
      question: "How long will delivery take?",
      answer: "Delivery times depend on your location and the shipping method you choose. Standard shipping typically takes 3-5 business days, Express shipping takes 2-3 business days, and Next Day Delivery is available for orders placed before 2pm. Please note that these times are estimates and may vary during busy periods or due to unforeseen circumstances."
    },
    {
      question: "Can I change my delivery address?",
      answer: "You can change your delivery address if your order hasn't been shipped yet. To do this, go to your account's order history, find the order you want to modify, and click on 'Change Address'. If your order has already been shipped, please contact our customer support team immediately for assistance."
    },
    {
      question: "What if I'm not home when my package arrives?",
      answer: "If you're not home during delivery, our carrier will typically leave the package at your door if it's safe to do so. For valuable items that require a signature, they'll leave a note with instructions on how to reschedule delivery or pick up your package from a local facility."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary based on the destination country. You can see the available shipping options and costs during checkout after entering your address."
    },
    {
      question: "How can I get free shipping?",
      answer: "We offer free standard shipping on all domestic orders over $50. Free shipping promotions are also regularly available for members of our loyalty program and during special sales events. Sign up for our newsletter to stay informed about these offers."
    },
    {
      question: "My order is delayed. What should I do?",
      answer: "If your order is taking longer than expected, first check your tracking information for any updates or delivery exceptions. If there's no clear explanation for the delay, please contact our customer support team with your order number, and we'll investigate the status of your shipment."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order if it hasn't been processed for shipping yet. To cancel, go to your account's order history, find the order you want to cancel, and click the 'Cancel Order' button. If you don't see this option, it means your order has already been processed, and you'll need to return the item after receiving it."
    },
    {
      question: "Can I get my order delivered on a specific date?",
      answer: "For certain areas, we offer scheduled delivery for an additional fee. During checkout, if this option is available for your location, you'll be able to select a preferred delivery date from a calendar. Please note that this service is not available in all areas."
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Real-time search is already handled by the input change
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactFormData);
    setFormSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setShowContactForm(false);
      setContactFormData({
        name: '',
        email: '',
        orderId: '',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <Link href="/help" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Help Center
          </Link>
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-lg p-3 text-blue-600 mr-4 shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Orders & Delivery</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Find answers to common questions about tracking orders, shipping options, delivery times, and more.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-12">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders and delivery questions"
            className="w-full pl-12 pr-4 py-4 border border-blue-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-500">No FAQs match your search query "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className={`flex justify-between items-center p-6 cursor-pointer ${openFaqs.includes(index) ? 'bg-blue-50' : 'hover:bg-blue-50/50'} transition-colors`}
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <div className={`h-6 w-6 border-2 border-blue-500 rounded-full flex items-center justify-center transition-transform ${openFaqs.includes(index) ? 'rotate-180 bg-blue-500 text-white' : 'text-blue-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 15l-6-6-6 6"/>
                    </svg>
                  </div>
                </div>
                {openFaqs.includes(index) && (
                  <div className="px-6 pb-6 text-gray-700 border-t border-blue-100 bg-white animate-fadeIn">
                    <p className="mt-4">{faq.answer}</p>
                    <div className="mt-6 text-sm text-gray-500 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                      <p>Was this answer helpful?</p>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-100 text-blue-700 transition-colors">Yes</button>
                        <button className="px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-100 text-blue-700 transition-colors">No</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 rounded-xl p-8 mb-16 border border-blue-200 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is ready to help you with any questions about your orders.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                onClick={() => setShowContactForm(true)}
              >
                Contact Support
              </Button>
              <Link href="/help">
                <Button variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 text-blue-700">
                  View All Help Topics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Order Support
                </h3>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {formSubmitted ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium mb-2">Thank You!</h4>
                  <p className="text-gray-600">
                    Your message has been sent successfully. Our support team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                      Order ID (if applicable)
                    </label>
                    <input
                      type="text"
                      id="orderId"
                      name="orderId"
                      value={contactFormData.orderId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      How can we help you?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={contactFormData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowContactForm(false)}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white">
                      Submit
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Related Help Topics */}
        <div>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 text-transparent bg-clip-text">Related Help Topics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/help/returns">
              <div className="border border-amber-100 rounded-lg p-5 hover:bg-amber-50 transition-colors group">
                <div className="flex items-center mb-2">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3 text-amber-600 group-hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                      <path d="M12 3v6"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold">Returns & Refunds</h3>
                </div>
                <p className="text-gray-600 text-sm pl-10">Learn about our return policy and refund process</p>
              </div>
            </Link>
            <Link href="/help/products">
              <div className="border border-green-100 rounded-lg p-5 hover:bg-green-50 transition-colors group">
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 p-2 rounded-lg mr-3 text-green-600 group-hover:bg-green-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7.5 4.27 9 5.15"></path>
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                      <path d="m3.3 7 8.7 5 8.7-5"></path>
                      <path d="M12 22V12"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold">Products & Inventory</h3>
                </div>
                <p className="text-gray-600 text-sm pl-10">Information about our products and availability</p>
              </div>
            </Link>
            <Link href="/help/account">
              <div className="border border-purple-100 rounded-lg p-5 hover:bg-purple-50 transition-colors group">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3 text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h3 className="font-semibold">Account & Orders</h3>
                </div>
                <p className="text-gray-600 text-sm pl-10">Manage your account and view order history</p>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
} 