import type { Request, Response } from 'express';
import { evaluateRules } from '../services/evaluateService.js';

export const evaluateSegments = async (req: Request, res: Response) => {
  try {
    const { rules } = req.body;
    if (!rules) return res.status(400).json({ error: 'rules (string) is required in body' });

    // evaluateRules will call product-service and return filtered results
    const result = await evaluateRules(rules);
    res.json(result);
  } catch (err: any) {
    console.error('Evaluate error:', err);
    if (err && (err.code === 'RULE_PARSE_ERROR')) {
      return res.status(400).json({ error: err.message || 'Invalid rule syntax' });
    }
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
};
