import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthCheckController';

const router = Router();

router.get('/health', getHealthStatus);

export default router;
