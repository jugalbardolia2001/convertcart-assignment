import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import segmentRoutes from './routes/segmentRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './docs/openapi.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/segments', segmentRoutes);
// Swagger UI and spec
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/docs.json', (_req, res) => {
    res.json(openapiSpec);
});
app.get('/health', (_req, res) => {
    res.json({ status: 'segment-service healthy' });
});
export default app;
