import axios from 'axios';
import dotenv from 'dotenv';
import { parseRulesToFilter } from '../utils/parseRules.js';

dotenv.config();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4000';

/**
 * evaluateRules:
 * - fetches products from product-service
 * - parses rules into JS filter predicates (parseRulesToFilter)
 * - returns filtered result
 */
export async function evaluateRules(rulesText: string) {
  // fetch all products from product-service
  const resp = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
  // product-service returns array or { total, data } — handle both
  const products = Array.isArray(resp.data) ? resp.data : (resp.data.data ?? resp.data);

  // parse rules to a list of predicate functions or a filter descriptor
  const predicates = parseRulesToFilter(rulesText);

  // filter in-memory (sufficient for this assignment)
  const filtered = products.filter((p: any) => predicates.every((pred: any) => pred(p)));

  return filtered;
}
