import { Router } from 'express';
import { testEmail } from '@/controllers/testEmailController';

const router = Router();

router.post('/test-email', testEmail);

export default router; 