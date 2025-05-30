import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '@/types';

const subscriptionSchema = new Schema<ISubscription>({
  email: { type: String, required: true },
  productId: { type: String, required: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Compound index for better performance
subscriptionSchema.index({ email: 1, productId: 1 }, { unique: true });
subscriptionSchema.index({ productId: 1, isActive: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
