import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function OrderNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center mb-6">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Link>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 max-w-md mb-6">
            We couldn't find the order you're looking for. It may have been removed or you may not have permission to view it.
          </p>
          <Link 
            href="/account/orders" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 