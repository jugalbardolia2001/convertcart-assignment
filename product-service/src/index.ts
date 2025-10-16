import app from './app.js';
import cron from 'node-cron'
import sequelize from './config/dbConfig.js';
import Product from './models/productsModel.js';
import { ingestWooProducts } from './services/ingestionService.js';
const PORT = Number(process.env.PORT || process.env.PRODUCT_SERVICE_PORT || 4000)

// Retry DB connection up to 3 times 
async function waitForDb(maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
      return;
    } catch (err: any) {
      if (attempt === maxAttempts) throw err;
      const delayMs = attempt * 2000; // 2s, 4s
      console.error(`DB connect failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`, err?.message || err);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function startServer() {
  try {
    await waitForDb(3);

    // sync model
    await Product.sync({ alter: true });
    console.log('Models synced successfully.');

    // cron: run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('Cron: starting scheduled ingestion');
      try {
        await ingestWooProducts();
      } catch (err) {
        console.error('Cron ingestion failed:', err);
      }
    });

    app.listen(PORT, () => {
      console.log(`Product service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to DB:', error);
  }
}

startServer();
