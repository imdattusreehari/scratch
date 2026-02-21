import { useState } from 'react'
import { today } from '../utils/dates.js'
import { recurrenceLabel } from '../utils/recurrence.js'

const DAY_OPTIONS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const CATEGORIES = ['Kitchen','Bathroom','Office','Common Area','Trash','Other']
const PRIORITIES = ['low','medium','high']

function defaultForm(chore, defaultDate) {
  if (chore) {
    return {
      name: chore.name,
      description: chore.description ?? '',
      priority: chore.priority ?? 'medium',
      category: chore.category ?? '',
      assignedTo: chore.assignedTo ?? '',
      recurrence: chore.recurrence ?? { type: 'once', date: today() },
    }
  }
  return {
    name: '',
    description: '',
    priority: 'medium',
    category: '',
    assignedTo: '',
    recurrence: { type: 'once', date: defaultDate ?? today() },
  }
}

export default function ChoreFormModal({ chore, defaultDate, members, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => defaultForm(chore, defaultDate))
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isNew = !chore

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setRecField(key, value) {
    setForm(f => ({ ...f, recurrence: { ...f.recurrence, [key]: value } }))
  }

  function setRecType(type) {
    const base = { type }
    if (type === 'once') base.date = form.recurrence.date ?? today()
    if (type === 'daily') { base.startDate = today(); base.endDate = '' }
    if (type === 'weekly') { base.startDate = today(); base.endDate = ''; base.daysOfWeek = [] }
    if (type === 'monthly') { base.startDate = today(); base.endDate = ''; base.dayOfMonth = 1 }
    setField('recurrence', base)
  }

  function toggleWeekDay(idx) {
    const current = form.recurrence.daysOfWeek ?? []
    const next = current.includes(idx)
      ? current.filter(d => d !== idx)
      : [...current, idx].sort()
    setRecField('daysOfWeek', next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...(chore ?? {}),
      name: form.name.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: form.category,
      assignedTo: form.assignedTo || null,
      recurrence: form.recurrence,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? 'Add Chore' : 'Edit Chore'}</h2>
          <button className="btn btn-ghost icon-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Name */}
          <label className="form-label">
            Name *
            <input
              className="form-input"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="e.g. Clean the kitchen"
              required
              autoFocus
            />
          </label>

          {/* Description */}
          <label className="form-label">
            Description
            <textarea
              className="form-input form-textarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Optional notes..."
              rows={2}
            />
          </label>

          <div className="form-row">
            {/* Priority */}
            <label className="form-label">
              Priority
              <select className="form-input" value={form.priority} onChange={e => setField('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </label>

            {/* Category */}
            <label className="form-label">
              Category
              <input
                className="form-input"
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                list="cat-list"
                placeholder="e.g. Kitchen"
              />
              <datalist id="cat-list">
                {CATEGORIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </label>
          </div>

          {/* Assignee */}
          <label className="form-label">
            Assign to
            <select className="form-input" value={form.assignedTo} onChange={e => setField('assignedTo', e.target.value)}>
              <option value="">— Unassigned —</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </label>

          {/* Recurrence type */}
          <label className="form-label">
            Schedule
            <select className="form-input" value={form.recurrence.type} onChange={e => setRecType(e.target.value)}>
              <option value="once">One-off date</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly (select days)</option>
              <option value="monthly">Monthly (day of month)</option>
            </select>
          </label>

          {/* Recurrence details */}
          {form.recurrence.type === 'once' && (
            <label className="form-label">
              Date
              <input
                type="date"
                className="form-input"
                value={form.recurrence.date ?? ''}
                onChange={e => setRecField('date', e.target.value)}
              />
            </label>
          )}

          {form.recurrence.type === 'weekly' && (
            <div className="form-label">
              Days of week
              <div className="day-picker">
                {DAY_OPTIONS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    className={`day-btn${(form.recurrence.daysOfWeek ?? []).includes(i) ? ' active' : ''}`}
                    onClick={() => toggleWeekDay(i)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.recurrence.type === 'monthly' && (
            <label className="form-label">
              Day of month
              <input
                type="number"
                className="form-input"
                min={1}
                max={31}
                value={form.recurrence.dayOfMonth ?? 1}
                onChange={e => setRecField('dayOfMonth', Number(e.target.value))}
              />
            </label>
          )}

          {form.recurrence.type !== 'once' && (
            <div className="form-row">
              <label className="form-label">
                Start date
                <input
                  type="date"
                  className="form-input"
                  value={form.recurrence.startDate ?? ''}
                  onChange={e => setRecField('startDate', e.target.value)}
                />
              </label>
              <label className="form-label">
                End date <span className="form-hint">(optional)</span>
                <input
                  type="date"
                  className="form-input"
                  value={form.recurrence.endDate ?? ''}
                  onChange={e => setRecField('endDate', e.target.value || null)}
                />
              </label>
            </div>
          )}

          <div className="modal-footer">
            {!isNew && (
              confirmDelete ? (
                <div className="confirm-delete">
                  <span>Delete this chore?</span>
                  <button type="button" className="btn btn-danger" onClick={() => onDelete(chore.id)}>Yes, delete</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              ) : (
                <button type="button" className="btn btn-ghost danger-text" onClick={() => setConfirmDelete(true)}>
                  Delete
                </button>
              )
            )}
            <div className="modal-footer-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {isNew ? 'Add Chore' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
