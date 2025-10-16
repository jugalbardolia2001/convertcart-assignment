import axios from 'axios';
import dotenv from 'dotenv';
import Product from '../models/productsModel.js';
import { mapWooToProductRows } from '../utils/mapWooToProductRow.js';
dotenv.config();
const BASE_URL = (() => {
    const v = process.env.WC_BASE_URL;
    if (!v)
        throw new Error('Missing env: WC_BASE_URL');
    return v.replace(/\/$/, '');
})();
const CK = (() => {
    const v = process.env.WC_CONSUMER_KEY;
    if (!v)
        throw new Error('Missing env: WC_CONSUMER_KEY');
    return v;
})();
const CS = (() => {
    const v = process.env.WC_CONSUMER_SECRET;
    if (!v)
        throw new Error('Missing env: WC_CONSUMER_SECRET');
    return v;
})();
const PER_PAGE = 50;
async function fetchPage(page = 1) {
    const url = `${BASE_URL}/wp-json/wc/v3/products`;
    const resp = await axios.get(url, {
        params: {
            consumer_key: CK,
            consumer_secret: CS,
            per_page: PER_PAGE,
            page
        },
        timeout: 20000
    });
    return resp.data || [];
}
export async function ingestWooProducts() {
    console.log('Starting WooCommerce ingestion...');
    let page = 1;
    let total = 0;
    while (true) {
        let products = [];
        try {
            products = await fetchPage(page);
        }
        catch (err) {
            console.error(`Failed to fetch page ${page}:`, err.message ?? err);
            break;
        }
        if (!products || products.length === 0)
            break;
        for (const p of products) {
            const row = mapWooToProductRows(p);
            try {
                await Product.upsert(row);
            }
            catch (err) {
                console.error(`Upsert failed for product id=${row.id}:`, err.message ?? err);
            }
        }
        total += products.length;
        console.log(`Page ${page} processed — ${products.length} items`);
        page++;
        if (products.length < PER_PAGE)
            break;
    }
    console.log(`Ingestion finished — total processed: ${total}`);
    return total;
}
