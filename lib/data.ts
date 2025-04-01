import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    description: 'Find the latest trends in fashion',
    image: '/images/clothing-category.jpg'
  },
  {
    id: '2',
    name: 'Electronics',
    description: 'Discover cutting-edge tech gadgets',
    image: '/images/electronics-category.jpg'
  },
  {
    id: '3',
    name: 'Home & Kitchen',
    description: 'Transform your living space with stylish, functional home goods and innovative kitchen essentials for cooking, entertaining, and organizing.',
    image: '/images/home-and-kitchen-category.jpg'
  },
  {
    id: '4',
    name: 'Beauty',
    description: 'Premium beauty and personal care',
    image: '/images/beauty-products-category.jpg'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt perfect for everyday wear. Features a classic fit and is available in multiple colors.',
    price: 24.99,
    category: 'Clothing',
    images: [
      '/images/premium-TShirt.jpg',
      '/images/premium-TShirt.jpg',
      '/images/premium-TShirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy', 'Gray'],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation, long battery life, and crystal-clear sound.',
    price: 79.99,
    category: 'Electronics',
    images: [
      '/images/earbuds-product.jpg',
      '/images/earbuds-product.jpg'
    ],
    colors: ['Black', 'White'],
    inStock: true,
    featured: true,
    newArrival: true
  },
  {
    id: '3',
    name: 'Smart Bluetooth Speaker',
    description: 'Voice-controlled smart speaker with premium sound quality and built-in virtual assistant.',
    price: 129.99,
    category: 'Electronics',
    images: [
      '/images/bluethooth-speaker-product.avif',
      '/images/bluethooth-speaker-product.avif'
    ],
    colors: ['Black', 'Gray', 'White'],
    inStock: true,
    featured: true,
    newArrival: true
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps beverages cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    category: 'Home & Kitchen',
    images: [
      '/images/stainlessSteel-bottle.avif',
      '/images/stainlessSteel-bottle.avif'
    ],
    colors: ['Silver', 'Black', 'Blue', 'Red'],
    inStock: true
  },
  {
    id: '5',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and RFID protection.',
    price: 49.99,
    category: 'Clothing',
    images: [
      '/images/leather-wallet.avif',
      '/images/leather-wallet.avif'
    ],
    colors: ['Brown', 'Black'],
    inStock: true
  },
  {
    id: '6',
    name: 'Premium Face Serum',
    description: 'Advanced skincare formula to hydrate and rejuvenate your skin.',
    price: 64.99,
    category: 'Beauty',
    images: [
      '/images/premium-face-serum.avif',
      '/images/premium-face-serum.avif'
    ],
    inStock: true,
    newArrival: true
  },
  {
    id: '7',
    name: 'Fitness Tracker Watch',
    description: 'Smart fitness tracker with heart rate monitoring, step counter, and sleep analysis.',
    price: 89.99,
    category: 'Electronics',
    images: [
      '/images/fitness-tracker-watch.avif',
      '/images/fitness-tracker-watch.avif',
      '/images/fitness-tracker-watch.avif'
    ],
    colors: ['Black', 'Blue', 'Pink'],
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Non-Stick Cooking Set',
    description: 'Set of 5 non-stick pans and pots, perfect for all cooking needs.',
    price: 149.99,
    category: 'Home & Kitchen',
    images: [
      '/images/non-sticky.avif',
      '/images/non-sticky.avif'
    ],
    inStock: true
  },
  {
    id: '9',
    name: 'Iphone 15 Pro Max',
    description: 'The latest iPhone model with advanced features and a sleek design.',
    price: 149.99,
    category: 'Electronics',
    images: [
      '/images/download.jpeg',
      '/images/download.jpeg',
      '/images/download.jpeg'
    ],
    inStock: true,
    featured: true,
    newArrival: true
  },
  {
    id: '10',
    name: 'Samsung S23',
    description: 'The latest Samsung S23 with advanced features and a sleek design.',
    price: 499.99,
    category: 'Electronics',
    images: [
      '/images/download.jpeg',
      '/images/download.jpeg',
      '/images/download.jpeg'
    ],
    inStock: true,
    featured: true,
    newArrival: true
  },
  {
    id: '11',
    name: 'Modern Kitchen Knife Set',
    description: 'Professional 6-piece kitchen knife set with ergonomic handles and sharp precision-forged blades.',
    price: 129.99,
    category: 'Home & Kitchen',
    images: [
      '/images/stainlessSteel-bottle.avif',
      '/images/stainlessSteel-bottle.avif'
    ],
    colors: ['Black', 'Silver'],
    inStock: true,
    featured: true
  },
  {
    id: '12',
    name: 'Smart Coffee Maker',
    description: 'WiFi-enabled coffee maker that you can control with your smartphone. Schedule brewing times and customize your coffee strength.',
    price: 149.99,
    category: 'Home & Kitchen',
    images: [
      '/images/bluethooth-speaker-product.avif',
      '/images/bluethooth-speaker-product.avif'
    ],
    colors: ['Black', 'White'],
    inStock: true,
    newArrival: true
  },
  {
    id: '13',
    name: 'Bamboo Kitchen Organization Set',
    description: 'Sustainable bamboo organizers for drawers, countertops, and pantry. Includes 5 pieces of various sizes.',
    price: 69.99,
    category: 'Home & Kitchen',
    images: [
      '/images/stainlessSteel-bottle.avif',
      '/images/stainlessSteel-bottle.avif'
    ],
    colors: ['Natural'],
    inStock: true,
    featured: true
  },
  {
    id: '14',
    name: 'Basic Cotton T-Shirt',
    description: 'Classic cotton t-shirt with a relaxed fit and round neckline. Perfect for layering or wearing on its own.',
    price: 19.99,
    category: 'Clothing',
    images: [
      '/images/premium-TShirt.jpg',
      '/images/premium-TShirt.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
    inStock: true
  },
  {
    id: '15',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact wireless speaker with rich sound and deep bass. Water-resistant design makes it perfect for outdoor use.',
    price: 59.99,
    category: 'Electronics',
    images: [
      '/images/bluethooth-speaker-product.avif',
      '/images/bluethooth-speaker-product.avif'
    ],
    colors: ['Black', 'Blue', 'Red'],
    inStock: true
  },
  {
    id: '16',
    name: 'Sports Water Bottle',
    description: 'Leak-proof sports water bottle with easy-grip design and built-in straw. Ideal for workouts and outdoor activities.',
    price: 24.99,
    category: 'Home & Kitchen',
    images: [
      '/images/stainlessSteel-bottle.avif',
      '/images/stainlessSteel-bottle.avif'
    ],
    colors: ['Blue', 'Green', 'Pink'],
    inStock: true
  },
  {
    id: '17',
    name: 'Compact Card Holder',
    description: 'Slim and minimalist card holder that fits perfectly in your front pocket. Holds up to 6 cards and some cash.',
    price: 29.99,
    category: 'Clothing',
    images: [
      '/images/leather-wallet.avif',
      '/images/leather-wallet.avif'
    ],
    colors: ['Brown', 'Black'],
    inStock: true
  },
  {
    id: '18',
    name: 'Moisturizing Face Cream',
    description: 'Rich, hydrating face cream with natural ingredients. Soothes dry skin and provides all-day moisture.',
    price: 34.99,
    category: 'Beauty',
    images: [
      '/images/premium-face-serum.avif',
      '/images/premium-face-serum.avif'
    ],
    inStock: true
  },
  {
    id: '19',
    name: 'Digital Fitness Band',
    description: 'Basic fitness tracker that monitors steps, distance, and calories burned. Water-resistant with a comfortable silicone band.',
    price: 49.99,
    category: 'Electronics',
    images: [
      '/images/fitness-tracker-watch.avif',
      '/images/fitness-tracker-watch.avif'
    ],
    colors: ['Black', 'Purple'],
    inStock: true
  },
  {
    id: '20',
    name: 'Frying Pan Set',
    description: 'Set of 3 non-stick frying pans in different sizes. Suitable for all stovetops including induction.',
    price: 79.99,
    category: 'Home & Kitchen',
    images: [
      '/images/non-sticky.avif',
      '/images/non-sticky.avif'
    ],
    inStock: true
  },
  {
    id: '21',
    name: 'Budget Smartphone',
    description: 'Affordable smartphone with a 6.2-inch display, 64GB storage, and dual camera system. Great value for money.',
    price: 199.99,
    category: 'Electronics',
    images: [
      '/images/download.jpeg',
      '/images/download.jpeg'
    ],
    inStock: true
  },
  {
    id: '22',
    name: 'Basic Kitchen Knife',
    description: 'Multi-purpose chef\'s knife with stainless steel blade and comfortable grip handle. Essential for every kitchen.',
    price: 19.99,
    category: 'Home & Kitchen',
    images: [
      '/images/stainlessSteel-bottle.avif',
      '/images/stainlessSteel-bottle.avif'
    ],
    colors: ['Black'],
    inStock: true
  },
  {
    id: '23',
    name: 'Automatic Tea Maker',
    description: 'Programmable tea maker with temperature control and brew timer. Makes the perfect cup of tea every time.',
    price: 89.99,
    category: 'Home & Kitchen',
    images: [
      '/images/bluethooth-speaker-product.avif',
      '/images/bluethooth-speaker-product.avif'
    ],
    colors: ['White', 'Black'],
    inStock: true
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter(product => product.newArrival);
}

export function getSaleProducts(): Product[] {
  // In a real app, you'd have a 'onSale' field in your Product type
  // For demo purposes, we'll create sale products by adding a discount to the first 5 products
  return products.slice(0, 5).map(product => ({
    ...product,
    originalPrice: product.price,
    price: Number((product.price * 0.7).toFixed(2)), // 30% discount
    discount: 30
  }));
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return [];
  
  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  });
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(category => category.id === id);
} 