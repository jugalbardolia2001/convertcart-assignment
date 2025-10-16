import type { Request, Response } from 'express';
import Product from '../models/productsModel.js';
import { ingestWooProducts } from '../services/ingestionService.js';

// fetch all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    
    const out = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      stock_status: p.stock_status,
      stock_quantity: p.stock_quantity,
      category: p.category,
      tags: p.tags,
      on_sale: p.on_sale,
      created_at: p.created_at ? new Date(p.created_at).toISOString() : null //created_at to ISO strings
    }));
    res.json({ total: out.length, data: out });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// trigger ingestion manually
export const triggerWooIngestion = async (_req: Request, res: Response) => {
  try {
    const total = await ingestWooProducts();
    res.json({ message: 'Ingestion completed', total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
