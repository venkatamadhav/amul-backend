import { Router } from 'express';
import { subscribeToProduct, unsubscribeFromProduct, getUserSubscriptions } from '@/controllers/subscriptionController';

const router = Router();

/**
 * @route   POST /api/subscribe
 * @desc    Subscribe to product notifications
 * @access  Public
 */
router.post('/subscribe', subscribeToProduct);

/**
 * @route   POST /api/unsubscribe
 * @desc    Unsubscribe from product notifications
 * @access  Public
 */
router.post('/unsubscribe', unsubscribeFromProduct);

/**
 * @route   GET /api/subscriptions/:email
 * @desc    Get user subscriptions
 * @access  Public
 */
router.get('/subscriptions/:email', getUserSubscriptions);

export default router;