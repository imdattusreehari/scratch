import { useState, useCallback } from 'react'
import { loadChores, saveChores, loadMembers, saveMembers, loadCompletions, saveCompletions } from './utils/storage.js'
import { today } from './utils/dates.js'
import CalendarHeader from './components/CalendarHeader.jsx'
import MonthView from './components/MonthView.jsx'
import WeekView from './components/WeekView.jsx'
import ChoreFormModal from './components/ChoreFormModal.jsx'
import TeamPanel from './components/TeamPanel.jsx'

const MEMBER_COLORS = [
  '#4f86f7','#f76f4f','#4fc97e','#f7c24f','#b44ff7',
  '#4ff7e8','#f74f9e','#8bc34a','#ff7043','#7e57c2',
]

function nextColor(members) {
  const used = new Set(members.map(m => m.color))
  return MEMBER_COLORS.find(c => !used.has(c)) ?? MEMBER_COLORS[members.length % MEMBER_COLORS.length]
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function App() {
  const [view, setView] = useState('month') // 'month' | 'week'
  const [cursor, setCursor] = useState(new Date())
  const [chores, setChores] = useState(() => loadChores())
  const [members, setMembers] = useState(() => loadMembers())
  const [completions, setCompletions] = useState(() => loadCompletions())
  const [choreModal, setChoreModal] = useState(null) // null | { chore } | { date }
  const [showTeam, setShowTeam] = useState(false)

  // ── Chore CRUD ──────────────────────────────────────────────────────────────

  const saveAndSetChores = useCallback((next) => {
    setChores(next)
    saveChores(next)
  }, [])

  const handleSaveChore = useCallback((chore) => {
    setChores(prev => {
      const exists = prev.find(c => c.id === chore.id)
      const next = exists
        ? prev.map(c => c.id === chore.id ? chore : c)
        : [...prev, { ...chore, id: genId() }]
      saveChores(next)
      return next
    })
    setChoreModal(null)
  }, [])

  const handleDeleteChore = useCallback((id) => {
    setChores(prev => {
      const next = prev.filter(c => c.id !== id)
      saveChores(next)
      return next
    })
    // Also remove completions for this chore
    setCompletions(prev => {
      const next = prev.filter(c => c.choreId !== id)
      saveCompletions(next)
      return next
    })
    setChoreModal(null)
  }, [])

  // ── Completions ─────────────────────────────────────────────────────────────

  const handleToggleComplete = useCallback((choreId, date) => {
    setCompletions(prev => {
      const key = `${choreId}:${date}`
      const exists = prev.some(c => c.choreId === choreId && c.date === date)
      const next = exists
        ? prev.filter(c => !(c.choreId === choreId && c.date === date))
        : [...prev, { choreId, date }]
      saveCompletions(next)
      return next
    })
  }, [])

  const isComplete = useCallback((choreId, date) => {
    return completions.some(c => c.choreId === choreId && c.date === date)
  }, [completions])

  // ── Team CRUD ────────────────────────────────────────────────────────────────

  const handleAddMember = useCallback((name) => {
    setMembers(prev => {
      const next = [...prev, { id: genId(), name, color: nextColor(prev) }]
      saveMembers(next)
      return next
    })
  }, [])

  const handleRemoveMember = useCallback((id) => {
    setMembers(prev => {
      const next = prev.filter(m => m.id !== id)
      saveMembers(next)
      return next
    })
    // Unassign chores assigned to this member
    setChores(prev => {
      const next = prev.map(c => c.assignedTo === id ? { ...c, assignedTo: null } : c)
      saveChores(next)
      return next
    })
  }, [])

  const openNewChore = useCallback((date) => {
    setChoreModal({ chore: null, defaultDate: date ?? today() })
  }, [])

  const openEditChore = useCallback((chore) => {
    setChoreModal({ chore, defaultDate: null })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-icon">✓</span>
          Office Chore Manager
        </div>
        <div className="app-header-actions">
          <button className="btn btn-primary" onClick={() => openNewChore(null)}>
            + Add Chore
          </button>
          <button className="btn btn-secondary" onClick={() => setShowTeam(true)}>
            Team
          </button>
        </div>
      </header>

      <CalendarHeader
        view={view}
        cursor={cursor}
        onViewChange={setView}
        onCursorChange={setCursor}
      />

      <main className="app-main">
        {view === 'month' ? (
          <MonthView
            cursor={cursor}
            chores={chores}
            members={members}
            isComplete={isComplete}
            onToggleComplete={handleToggleComplete}
            onClickChore={openEditChore}
            onClickDay={openNewChore}
          />
        ) : (
          <WeekView
            cursor={cursor}
            chores={chores}
            members={members}
            isComplete={isComplete}
            onToggleComplete={handleToggleComplete}
            onClickChore={openEditChore}
            onClickDay={openNewChore}
          />
        )}
      </main>

      {choreModal !== null && (
        <ChoreFormModal
          chore={choreModal.chore}
          defaultDate={choreModal.defaultDate}
          members={members}
          onSave={handleSaveChore}
          onDelete={handleDeleteChore}
          onClose={() => setChoreModal(null)}
        />
      )}

      {showTeam && (
        <TeamPanel
          members={members}
          onAdd={handleAddMember}
          onRemove={handleRemoveMember}
          onClose={() => setShowTeam(false)}
        />
      )}
    </div>
  )
}
