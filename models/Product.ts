import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  featured: boolean;
  colors?: string[];
  ratings?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a product image'],
    },
    inStock: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    colors: {
      type: [String],
      default: []
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Check if the model is already defined (for Next.js hot reloading)
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 