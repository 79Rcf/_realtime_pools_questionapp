import { signUp, signIn, signOut } from '../controllers/auth.js';
import authMiddleware, { protect } from '../middlewares/authMiddleware.js';

router.post('/signUp', signUp);

router.post('/signIn', signIn);

router.post('/signOut', signOut);

router.post('/authmiddleware', protect, authMiddleware);

export default router;

