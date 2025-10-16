import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './docs/openapi.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
// Swagger UI and spec
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/docs.json', (_req, res) => {
    res.json(openapiSpec);
});
// Check Health
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Product service healthy' });
});
export default app;
