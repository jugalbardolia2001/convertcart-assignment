import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard.jsx'

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:4000'
const SEGMENT_SERVICE_URL = import.meta.env.VITE_SEGMENT_SERVICE_URL || 'http://localhost:4001'

const SAMPLE_RULES = `price > 0\nstock_status = instock\nstock_quantity >= 1\non_sale = true`

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [rules, setRules] = useState(SAMPLE_RULES)
  const [result, setResult] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  const [validation, setValidation] = useState({ ok: true, messages: [] })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${PRODUCT_SERVICE_URL}/products`)
        const json = await res.json()
        const arr = Array.isArray(json) ? json : (json.data ?? [])
        setProducts(arr)
      } catch (e) {
        setError(e?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function validateRulesText(text) {
    const msgs = []
    const trimmed = (text || '').trim()
    if (!trimmed) {
      msgs.push('Rules are required.')
    }
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean)
    const MAX_LINES = 20
    if (lines.length > MAX_LINES) msgs.push(`Too many lines: ${lines.length} (max ${MAX_LINES}).`)
    const opRe = /^(\w+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/
    lines.forEach((line, idx) => {
      if (!opRe.test(line)) msgs.push(`Line ${idx + 1}: invalid syntax.`)
      else {
        // very light value checks for booleans
        const m = line.match(opRe)
        const field = m[1]; const op = m[2]; const val = m[3].trim()
        if (field === 'on_sale' && !['true','false'].includes(val)) msgs.push(`Line ${idx + 1}: on_sale must be true/false.`)
        if ((field === 'price' || field === 'stock_quantity') && isNaN(Number(val))) msgs.push(`Line ${idx + 1}: numeric value expected.`)
      }
    })
    return { ok: msgs.length === 0, messages: msgs }
  }

  useEffect(() => {
    setValidation(validateRulesText(rules))
  }, [rules])

  async function onEvaluate() {
    try {
      const v = validateRulesText(rules)
      setValidation(v)
      if (!v.ok) {
        setError(v.messages.join(' '))
        return
      }
      setEvaluating(true)
      setError('')
      const res = await fetch(`${SEGMENT_SERVICE_URL}/segments/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `Request failed with ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e?.message || 'Failed to evaluate rules')
    } finally {
      setEvaluating(false)
    }
  }

  function onReset() {
    setRules('')
    setResult(null)
  }

  const productsCount = products.length
  const resultCount = useMemo(() => Array.isArray(result) ? result.length : 0, [result])

  return (
    <div className="container">
      <header className="header">
        <h1>Segment Editor</h1>
        <div className="env">
          <span>Product API: {PRODUCT_SERVICE_URL}</span>
          <span>Segment API: {SEGMENT_SERVICE_URL}</span>
        </div>
      </header>

      <section className="editor">
        <h2>Define Filter Conditions</h2>
        <label className="label">Enter filter rules (one per line):</label>
        <textarea value={rules} onChange={e => setRules(e.target.value)} placeholder={SAMPLE_RULES} rows={10} />
        <div className="hint">Examples: price &gt; 5000, category = Smartphones, stock_status = instock</div>
        <div className="actions">
          <button className="primary" onClick={onEvaluate} disabled={evaluating || !validation.ok}>⏵ Evaluate Filter</button>
          <button onClick={onReset}>↺ Reset</button>
        </div>
        {!validation.ok && (
          <div className="error">
            {validation.messages.map((m, i) => <div key={i}>{m}</div>)}
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </section>

      <section className="results">
        <div className="split">
          <div>
            <h3>All Products ({productsCount})</h3>
            {loading ? <div className="muted">Loading products...</div> : (
              <div className="grid">
                {products.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
          <div>
            <h3>Filtered Result ({resultCount})</h3>
            {!result && <div className="muted">Run a filter to see results.</div>}
            {Array.isArray(result) && (
              <>
                <div className="grid">
                  {result.map(p => <ProductCard key={p.id} p={p} highlighted />)}
                </div>
                <details>
                  <summary>View raw JSON</summary>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </details>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="muted">Supported operators: =, !=, &gt;, &lt;, &gt;=, &lt;=</div>
      </footer>
    </div>
  )
}
