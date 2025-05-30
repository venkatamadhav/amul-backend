import { Router, Request, Response } from 'express';
import { ApiResponse } from '@/types';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  };
  res.json(response);
});

export default router;