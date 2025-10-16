export function parseRulesToFilter(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const preds = [];
    for (const line of lines) {
        const m = line.match(/^(\w+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/);
        if (!m) {
            const err = new Error(`Invalid rule syntax: "${line}"`);
            err.code = 'RULE_PARSE_ERROR';
            throw err;
        }
        const [, field, op, rawValue] = m;
        const value = rawValue.trim();
        if (field === 'price') {
            const num = parseFloat(value);
            if (Number.isNaN(num)) {
                const err = new Error(`Invalid numeric value for price: "${value}"`);
                err.code = 'RULE_PARSE_ERROR';
                throw err;
            }
            preds.push((p) => {
                const pv = parseFloat(String(p.price || '0')) || 0;
                if (op === '>')
                    return pv > num;
                if (op === '<')
                    return pv < num;
                if (op === '=')
                    return pv === num;
                if (op === '>=')
                    return pv >= num;
                if (op === '<=')
                    return pv <= num;
                if (op === '!=')
                    return pv !== num;
                return false;
            });
        }
        else if (field === 'stock_quantity') {
            const num = parseFloat(value);
            if (Number.isNaN(num)) {
                const err = new Error(`Invalid numeric value for stock_quantity: "${value}"`);
                err.code = 'RULE_PARSE_ERROR';
                throw err;
            }
            preds.push((p) => {
                const sv = parseFloat(String(p.stock_quantity ?? '0')) || 0;
                if (op === '>')
                    return sv > num;
                if (op === '<')
                    return sv < num;
                if (op === '=')
                    return sv === num;
                if (op === '>=')
                    return sv >= num;
                if (op === '<=')
                    return sv <= num;
                if (op === '!=')
                    return sv !== num;
                return false;
            });
        }
        else if (field === 'on_sale') {
            const bool = value === 'true';
            preds.push((p) => op === '!=' ? Boolean(p.on_sale) !== bool : Boolean(p.on_sale) === bool);
        }
        else if (field === 'stock_status') {
            preds.push((p) => op === '!=' ? String(p.stock_status) !== value : String(p.stock_status) === value);
        }
        else {
            if (op !== '=' && op !== '!=') {
                const err = new Error(`Only '=' and '!=' supported for field ${field}`);
                err.code = 'RULE_PARSE_ERROR';
                throw err;
            }
            preds.push((p) => {
                const v = p[field];
                return op === '!=' ? String(v) !== value : String(v) === value;
            });
        }
    }
    return preds;
}
