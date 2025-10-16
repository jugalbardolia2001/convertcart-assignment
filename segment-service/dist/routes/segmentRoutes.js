import { Router } from 'express';
import { evaluateSegments } from '../controllers/segmentController.js';
const router = Router();
router.post('/evaluate', evaluateSegments);
export default router;
