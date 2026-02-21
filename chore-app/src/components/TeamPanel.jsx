import { useState } from 'react'

export default function TeamPanel({ members, onAdd, onRemove, onClose }) {
  const [name, setName] = useState('')
  const [confirmRemove, setConfirmRemove] = useState(null)

  function handleAdd(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Team Members</h2>
          <button className="btn btn-ghost icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="team-list">
          {members.length === 0 && (
            <p className="empty-state">No team members yet. Add one below.</p>
          )}
          {members.map(m => (
            <div key={m.id} className="team-row">
              <span className="team-dot" style={{ background: m.color }} />
              <span className="team-name">{m.name}</span>
              {confirmRemove === m.id ? (
                <div className="team-confirm">
                  <button className="btn btn-danger btn-sm" onClick={() => { onRemove(m.id); setConfirmRemove(null) }}>
                    Remove
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmRemove(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm danger-text" onClick={() => setConfirmRemove(m.id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="team-add-form">
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="New member name"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      </div>
    </div>
  )
}
