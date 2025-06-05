import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  productId: string;
  telegramUsername?: string; // Optional telegram username
  subscribedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  productId: { 
    type: String, 
    required: true 
  },
  telegramUsername: {
    type: String,
    required: false,
    trim: true,
    default: null
  },
  subscribedAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
subscriptionSchema.index({ email: 1, productId: 1 }, { unique: true });
subscriptionSchema.index({ productId: 1, isActive: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);