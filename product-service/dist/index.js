import app from './app.js';
import cron from 'node-cron';
import sequelize from './config/dbConfig.js';
import Product from './models/productsModel.js';
import { ingestWooProducts } from './services/ingestionService.js';
const PORT = process.env.PRODUCT_SERVICE_PORT || 4000;
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // sync model
        await Product.sync({ alter: true });
        console.log('Models synced successfully.');
        // cron: run every 1 hours
        cron.schedule('0 */1 * * *', async () => {
            console.log('Cron: starting scheduled ingestion');
            try {
                await ingestWooProducts();
            }
            catch (err) {
                console.error('Cron ingestion failed:', err);
            }
        });
        app.listen(PORT, () => {
            console.log(`Product service listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to connect to DB:', error);
    }
}
startServer();
