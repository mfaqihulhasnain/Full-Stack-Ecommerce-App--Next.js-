import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  clerkId: string;
  role: 'customer' | 'admin';
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    clerkId: {
      type: String,
      required: [true, 'Please provide a clerk ID'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    addresses: [
      {
        street: {
          type: String,
          required: [true, 'Please provide a street address'],
        },
        city: {
          type: String,
          required: [true, 'Please provide a city'],
        },
        state: {
          type: String,
          required: [true, 'Please provide a state'],
        },
        zipCode: {
          type: String,
          required: [true, 'Please provide a zip code'],
        },
        country: {
          type: String,
          required: [true, 'Please provide a country'],
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined (for Next.js hot reloading)
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 