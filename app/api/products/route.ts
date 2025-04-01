import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get the search parameters from the URL
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build the query
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (inStock === 'true') {
      query.inStock = true;
    }
    
    // Fetch products from database
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get the request body
    const body = await req.json();
    
    // Create new product
    const product = await Product.create(body);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: { [key: string]: string } = {};
      
      // Extract validation error messages
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return NextResponse.json(
        { error: 'Validation Error', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
 