import { Router } from 'express';
import { getAllProducts, triggerWooIngestion } from '../controllers/productController.js';
const router = Router();
router.get('/', getAllProducts);
router.get('/ingest', triggerWooIngestion);
export default router;
