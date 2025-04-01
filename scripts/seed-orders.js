/**
 * Seed script to create test orders in the database
 * Run with: node scripts/seed-orders.js
 */

const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';

async function seedOrders() {
  console.log('Connecting to MongoDB...');
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    
    // Check if Users collection exists and has data
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    if (userCount === 0) {
      console.error('No users found in the database. Please create a user first.');
      await client.close();
      return;
    }
    
    // Get a sample user from the database to associate with orders
    const sampleUser = await usersCollection.findOne({});
    
    if (!sampleUser) {
      console.error('Failed to find a sample user');
      await client.close();
      return;
    }
    
    console.log(`Using user: ${sampleUser.firstName} ${sampleUser.lastName} (${sampleUser._id})`);
    
    // Check if products collection exists
    const productsCollection = db.collection('products');
    const productCount = await productsCollection.countDocuments();
    
    if (productCount === 0) {
      console.log('No products found. Creating sample products...');
      
      // Create sample products
      const sampleProducts = [
        {
          name: 'Sample Smartphone',
          price: 599.99,
          image: '/images/placeholder.png',
          category: 'Electronics',
          description: 'A high-quality smartphone with great features',
          stockQuantity: 10
        },
        {
          name: 'Designer T-Shirt',
          price: 49.99,
          image: '/images/placeholder.png',
          category: 'Clothing',
          description: 'A stylish t-shirt for any occasion',
          stockQuantity: 25
        },
        {
          name: 'Bluetooth Headphones',
          price: 129.99,
          image: '/images/placeholder.png',
          category: 'Electronics',
          description: 'Wireless headphones with noise cancellation',
          stockQuantity: 15
        }
      ];
      
      const result = await productsCollection.insertMany(sampleProducts);
      console.log(`Created ${result.insertedCount} sample products`);
    }
    
    // Get a few sample products to use in orders
    const sampleProducts = await productsCollection.find({}).limit(3).toArray();
    
    if (sampleProducts.length === 0) {
      console.error('Failed to find sample products');
      await client.close();
      return;
    }
    
    // Create orders collection if it doesn't exist
    const ordersCollection = db.collection('orders');
    
    // Create sample orders
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const sampleOrders = [
      {
        user: sampleUser._id,
        orderNumber: `ORD-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-12345`,
        items: [
          {
            product: sampleProducts[0]._id,
            name: sampleProducts[0].name,
            price: sampleProducts[0].price,
            quantity: 1,
            image: sampleProducts[0].image || '/images/placeholder.png'
          },
          {
            product: sampleProducts[1]._id,
            name: sampleProducts[1].name,
            price: sampleProducts[1].price,
            quantity: 2,
            image: sampleProducts[1].image || '/images/placeholder.png'
          }
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: sampleProducts[0].price + (sampleProducts[1].price * 2),
        shippingPrice: 9.99,
        taxPrice: 12.50,
        totalPrice: sampleProducts[0].price + (sampleProducts[1].price * 2) + 9.99 + 12.50,
        isPaid: true,
        paidAt: now,
        isDelivered: false,
        status: 'processing',
        createdAt: now,
        updatedAt: now
      },
      {
        user: sampleUser._id,
        orderNumber: `ORD-${oneWeekAgo.getFullYear().toString().slice(-2)}${(oneWeekAgo.getMonth() + 1).toString().padStart(2, '0')}${oneWeekAgo.getDate().toString().padStart(2, '0')}-54321`,
        items: [
          {
            product: sampleProducts[2]._id,
            name: sampleProducts[2].name,
            price: sampleProducts[2].price,
            quantity: 1,
            image: sampleProducts[2].image || '/images/placeholder.png'
          }
        ],
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Othertown',
          state: 'NY',
          zipCode: '67890',
          country: 'USA'
        },
        paymentMethod: 'PayPal',
        itemsPrice: sampleProducts[2].price,
        shippingPrice: 4.99,
        taxPrice: 5.25,
        totalPrice: sampleProducts[2].price + 4.99 + 5.25,
        isPaid: true,
        paidAt: oneWeekAgo,
        isDelivered: true,
        deliveredAt: new Date(oneWeekAgo.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'delivered',
        createdAt: oneWeekAgo,
        updatedAt: oneWeekAgo
      },
      {
        user: sampleUser._id,
        orderNumber: `ORD-${twoWeeksAgo.getFullYear().toString().slice(-2)}${(twoWeeksAgo.getMonth() + 1).toString().padStart(2, '0')}${twoWeeksAgo.getDate().toString().padStart(2, '0')}-98765`,
        items: [
          {
            product: sampleProducts[0]._id,
            name: sampleProducts[0].name,
            price: sampleProducts[0].price,
            quantity: 1,
            image: sampleProducts[0].image || '/images/placeholder.png'
          }
        ],
        shippingAddress: {
          street: '789 Pine St',
          city: 'Sometown',
          state: 'TX',
          zipCode: '54321',
          country: 'USA'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: sampleProducts[0].price,
        shippingPrice: 4.99,
        taxPrice: 5.25,
        totalPrice: sampleProducts[0].price + 4.99 + 5.25,
        isPaid: true,
        paidAt: twoWeeksAgo,
        isDelivered: false,
        status: 'cancelled',
        createdAt: twoWeeksAgo,
        updatedAt: twoWeeksAgo
      }
    ];
    
    // Check if orders already exist
    const existingOrders = await ordersCollection.countDocuments({ user: sampleUser._id });
    
    if (existingOrders > 0) {
      console.log(`${existingOrders} orders already exist for this user.`);
      
      // Ask if we should continue
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Do you want to add more sample orders? (y/n) ', async (answer) => {
        readline.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          // Insert orders
          const result = await ordersCollection.insertMany(sampleOrders);
          console.log(`Created ${result.insertedCount} sample orders`);
        } else {
          console.log('No new orders created.');
        }
        
        await client.close();
        console.log('Database connection closed');
      });
    } else {
      // Insert orders
      const result = await ordersCollection.insertMany(sampleOrders);
      console.log(`Created ${result.insertedCount} sample orders`);
      
      await client.close();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
}

// Run the seed function
seedOrders(); 