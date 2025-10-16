import React from 'react'

export default function ProductCard({ p, highlighted }) {
  return (
    <div className={`card ${highlighted ? 'card--highlight' : ''}`}>
      <div className="card__header">
        <div className="card__title">{p.title}</div>
        {p.on_sale ? <span className="badge badge--sale">On Sale</span> : null}
      </div>
      <div className="card__meta">
        <div><strong>Price:</strong> {p.price ?? '—'}</div>
        <div><strong>Stock:</strong> {p.stock_status} {p.stock_quantity != null ? `(${p.stock_quantity})` : ''}</div>
        <div><strong>Category:</strong> {p.category ?? '—'}</div>
        <div><strong>Tags:</strong> {Array.isArray(p.tags) && p.tags.length ? p.tags.join(', ') : '—'}</div>
        <div className="muted small"><strong>Created:</strong> {p.created_at ?? '—'}</div>
      </div>
    </div>
  )
}
