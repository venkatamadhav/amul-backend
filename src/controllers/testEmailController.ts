import { Request, Response } from 'express';
import { fakeNotify } from '@/services/emailService';
import { verifyEmailConfig } from '@/config/email';

export const testEmail = (req: Request, res: Response): void => {
  const { email, productId } = req.body;
  if (!email || !productId) {
    res.status(400).json({ error: 'Email and productId are required' });
    return;
  }

  verifyEmailConfig()
    .then(isConfigValid => {
      if (!isConfigValid) {
        throw new Error('Email configuration is invalid');
      }
      return fakeNotify(email, productId);
    })
    .then(() => {
      res.status(200).json({ message: 'Test email sent successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: error.message || 'Failed to send test email' });
    });
}; 