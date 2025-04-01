# NovaBuy - Full Stack E-commerce Application Documentation

## Project Overview

NovaBuy is a modern, full-stack e-commerce application built with Next.js, TypeScript, MongoDB, and Clerk for authentication. The application provides a seamless shopping experience with features such as product browsing, cart management, user authentication, order processing, and an admin dashboard.

![NovaBuy Demo](public/images/heroimage.jpg)

## Tech Stack

### Frontend
- **Next.js 15**: React framework with server-side rendering and API routes
- **TypeScript**: Static typing for improved code quality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth UI transitions
- **Zustand**: State management library (used for cart functionality)
- **React Icons & Lucide React**: Icon libraries
- **Clerk**: Authentication and user management

### Backend
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **Next.js API Routes**: Backend API implementation

## Project Structure

```
├── app/                     # Next.js app directory (pages and API routes)
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   └── [various routes]/    # Page components for different routes
├── components/              # Reusable UI components
│   ├── cart/                # Cart-related components
│   ├── layout/              # Header, footer, and layout components
│   ├── product/             # Product-related components
│   ├── search/              # Search components
│   └── ui/                  # Base UI components (buttons, inputs, etc.)
├── lib/                     # Utility functions and data
│   ├── data.ts              # Mock data for products and categories
│   ├── db.ts                # Database connection setup
│   ├── mongodb.ts           # MongoDB connection utility
│   ├── store.ts             # Zustand store for cart management
│   └── utils.ts             # Common utility functions
├── models/                  # Mongoose data models
│   ├── Order.ts             # Order schema and model
│   ├── Product.ts           # Product schema and model
│   └── User.ts              # User schema and model
├── providers/               # React context providers
├── public/                  # Static assets
├── types/                   # TypeScript type definitions
└── middleware.ts            # Clerk authentication middleware
```

## Core Features

### 1. Authentication System
- **Technology**: Clerk Authentication
- **Features**:
  - User registration and login
  - Social auth providers
  - Protected routes
  - User profile management

### 2. Product Management
- **Features**:
  - Product listing with filtering and sorting
  - Product categories
  - Product details page
  - Featured products
  - New arrivals section

### 3. Shopping Cart
- **Technology**: Zustand with persist middleware
- **Features**:
  - Add/remove items
  - Update quantities
  - Persistent cart (survives page refresh)
  - Total price calculation

### 4. Checkout Process
- Shipping address selection/input
- Payment method selection
- Order summary
- Order confirmation

### 5. User Account
- Order history
- Saved addresses
- Profile management
- Wishlist

### 6. Admin Panel
- Product management (CRUD operations)
- Order management
- User management
- Sales analytics

## Database Models

### 1. Product Model
```typescript
{
  name: string;              // Product name
  description: string;       // Product description
  price: number;             // Product price
  category: string;          // Product category
  image: string;             // Main product image URL
  inStock: boolean;          // Availability status
  featured: boolean;         // Featured product flag
  colors: string[];          // Available colors
  ratings: number;           // Average rating
  reviewCount: number;       // Number of reviews
  createdAt: Date;           // Creation timestamp
  updatedAt: Date;           // Last update timestamp
}
```

### 2. User Model
```typescript
{
  firstName: string;         // User's first name
  lastName: string;          // User's last name
  email: string;             // User's email
  clerkId: string;           // Clerk authentication ID
  role: 'customer' | 'admin'; // User role
  addresses: [{              // User's addresses
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }];
  wishlist: ObjectId[];      // Array of product IDs
  createdAt: Date;           // Account creation date
  updatedAt: Date;           // Last update date
}
```

### 3. Order Model
```typescript
{
  user: ObjectId;            // Reference to User
  orderNumber: string;       // Unique order number
  items: [{                  // Order items
    product: ObjectId;       // Reference to Product
    name: string;            // Product name
    price: number;           // Product price
    quantity: number;        // Quantity ordered
    image: string;           // Product image
  }];
  shippingAddress: {         // Shipping address
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;     // Payment method
  paymentResult: {           // Payment details
    id: string;
    status: string;
    email_address: string;
  };
  itemsPrice: number;        // Total items price
  shippingPrice: number;     // Shipping cost
  taxPrice: number;          // Tax amount
  totalPrice: number;        // Total order price
  isPaid: boolean;           // Payment status
  paidAt: Date;              // Payment timestamp
  isDelivered: boolean;      // Delivery status
  deliveredAt: Date;         // Delivery timestamp
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;           // Order creation date
  updatedAt: Date;           // Last update date
}
```

## API Endpoints

### Products
- `GET /api/products`: Get all products with optional filtering
- `GET /api/products/[id]`: Get product by ID
- `POST /api/products`: Create new product (admin)
- `PUT /api/products/[id]`: Update product (admin)
- `DELETE /api/products/[id]`: Delete product (admin)

### Users
- `GET /api/user`: Get current user profile
- `PUT /api/user`: Update user profile
- `GET /api/user/addresses`: Get user addresses
- `POST /api/user/addresses`: Add new address
- `PUT /api/user/addresses/[id]`: Update address
- `DELETE /api/user/addresses/[id]`: Delete address

### Orders
- `GET /api/orders`: Get user orders
- `GET /api/orders/[id]`: Get order by ID
- `POST /api/orders`: Create new order
- `PUT /api/orders/[id]`: Update order status (admin)

## State Management

The application uses Zustand for client-side state management, primarily for the shopping cart functionality. The cart state includes:

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      // Various cart operations
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
```

This provides:
- Cart items with product details
- Functions to add, remove, and update items
- Functions to calculate totals
- Persistence using localStorage

## Authentication

Authentication is implemented using Clerk, which provides:

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Appearance customization
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <UserProvider>
            <MainLayout>{children}</MainLayout>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

Protected routes are implemented using Clerk's middleware:

```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Database Connection

MongoDB connection is established through a utility function:

```typescript
// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Connection logic with caching for performance
}
```

## UI Components

The project includes a comprehensive set of UI components built with Tailwind CSS:

- Buttons, inputs, selects
- Cards and containers
- Modals and popovers
- Loading states and skeletons
- Optimized image components

Example component:

```tsx
// components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
  // Props definition
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

## Responsive Design

The UI is fully responsive, using Tailwind CSS breakpoints to ensure a consistent experience across:
- Mobile devices
- Tablets
- Desktop browsers

Example responsive implementation:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

## Deployment

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database (local or Atlas)
- Clerk account for authentication

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Clerk app URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

### Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```
5. Start the production server:
   ```
   npm start
   ```

### Deployment Options
- Vercel: Recommended for Next.js applications
- Netlify: Alternative deployment option
- Self-hosted: For custom server configurations

## Future Enhancements

Potential future enhancements for the application:
1. Integration with payment gateways (Stripe, PayPal)
2. Product reviews and ratings system
3. Enhanced search with filters and pagination
4. Email notifications for orders
5. Inventory management system
6. Multi-language support
7. PWA capabilities for offline access
8. Advanced analytics dashboard

## Performance Optimization

The application includes several performance optimizations:
- Image optimization using Next.js Image component
- MongoDB connection pooling
- Client-side caching where appropriate
- Code splitting and lazy loading
- Server-side rendering for SEO and initial load performance

## Troubleshooting

Common issues and their solutions:
- Database connection problems: Check MongoDB URI and network access
- Authentication issues: Verify Clerk API keys and configuration
- Styling inconsistencies: Check Tailwind configuration

## Conclusion

NovaBuy is a comprehensive e-commerce solution that demonstrates modern web development practices using Next.js, TypeScript, and MongoDB. The application provides a complete shopping experience from browsing products to checkout and order management, with a focus on user experience and performance.

Built as a personal project, it showcases advanced skills in full-stack development and modern web technologies. 