// routes/testEmailRoutes.ts - Updated with Telegram testing
import { Router, Request, Response } from 'express';
import { fakeNotify } from '@/services/emailService';

const router = Router();

interface TestNotificationRequest {
  email: string;
  productId: string;
  telegramUsername?: string;
}

/**
 * @route   POST /api/test-notification
 * @desc    Send test email and telegram notification
 * @access  Public (should be protected in production)
 */
router.post('/test-notification', async (req: Request<{}, {}, TestNotificationRequest>, res: Response): Promise<void> => {
  try {
    const { email, productId, telegramUsername } = req.body;
    
    if (!email || !productId) {
      res.status(400).json({
        success: false,
        error: 'Email and productId are required'
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
      return;
    }
    
    // Validate telegram username if provided
    if (telegramUsername) {
      const telegramRegex = /^[a-zA-Z0-9_]{5,32}$/;
      const cleanUsername = telegramUsername.replace('@', '');
      if (!telegramRegex.test(cleanUsername)) {
        res.status(400).json({
          success: false,
          error: 'Invalid Telegram username format'
        });
        return;
      }
    }
    
    await fakeNotify(email, productId, telegramUsername);
    
    const notificationTypes = ['email'];
    if (telegramUsername) {
      notificationTypes.push('telegram');
    }
    
    res.json({
      success: true,
      message: `Test notifications sent via ${notificationTypes.join(' and ')}`
    });
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;