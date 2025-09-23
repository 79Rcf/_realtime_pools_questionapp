import { signUp, signIn, signOut } from '../controllers/auth.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimtter.js'
import { Router } from 'express';

const router = Router();

router.post('/signUp', authLimiter, signUp);

router.post('/signIn', authLimiter, signIn);

router.post('/signOut', signOut);


router.post("/authmiddleware", protect, (req, res) => {
    res.json({ message: "You are authorized", user: req.user });
});

export default router;

