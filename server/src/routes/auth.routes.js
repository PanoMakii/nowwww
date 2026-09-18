import { Router } from 'express';
import { login, signup, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/login', validate('login'), login);
router.post('/signup', validate('register'), signup);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

export default router;

