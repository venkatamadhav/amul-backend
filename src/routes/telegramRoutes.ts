// routes/telegramRoutes.ts - Handle Telegram webhook
import { Router, Request, Response } from 'express';
import { telegramService } from '@/services/telegramService';

const router = Router();

interface TelegramWebhookBody {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text: string;
  };
}

/**
 * @route   POST /api/telegram/webhook
 * @desc    Handle Telegram bot webhook
 * @access  Public (but should be secured in production)
 */
router.post('/webhook', async (req: Request<{}, {}, TelegramWebhookBody>, res: Response) => {
  try {
    const update = req.body;
    
    // Handle /start command to register user
    if (update.message?.text === '/start' && update.message?.from?.username) {
      await telegramService.handleBotStart(
        update.message.from.username,
        update.message.chat.id
      );
      
      // You can send a welcome message here if needed
      console.log(`📱 New user @${update.message.from.username} started the bot`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error handling Telegram webhook:', error);
    res.status(500).send('Error');
  }
});

/**
 * @route   POST /api/telegram/set-webhook
 * @desc    Set Telegram webhook URL
 * @access  Private (should be protected)
 */
// router.post('/set-webhook', async (req: Request, res: Response) => {
//   try {
//     const webhookUrl = req.body.url;
    
//     if (!webhookUrl) {
//       return res.status(400).json({ error: 'Webhook URL is required' });
//     }
    
//     // This would typically call Telegram API to set webhook
//     // You can implement this if needed for dynamic webhook setup
    
//     res.json({ success: true, message: 'Webhook setup instructions provided' });
//   } catch (error) {
//     console.error('❌ Error setting webhook:', error);
//     res.status(500).json({ error: 'Failed to set webhook' });
//   }
// });

export default router;