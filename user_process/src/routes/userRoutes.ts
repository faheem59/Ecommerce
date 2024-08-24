

import { Router } from 'express';
import { register, login, logout, getUserById } from '../controllers/userController';

const router: Router = Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users/:userId', getUserById);
export default router;
