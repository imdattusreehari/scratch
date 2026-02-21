const PRIORITY_DOT = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

export default function ChoreCard({ chore, member, complete, onToggle, onClick }) {
  const dotColor = PRIORITY_DOT[chore.priority] ?? '#94a3b8'
  const memberColor = member?.color ?? '#94a3b8'

  return (
    <div
      className={`chore-card${complete ? ' chore-done' : ''}`}
      style={{ borderLeftColor: memberColor }}
      onClick={(e) => { e.stopPropagation(); onClick(chore) }}
    >
      <div className="chore-card-inner">
        <button
          className={`chore-check${complete ? ' checked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          title={complete ? 'Mark incomplete' : 'Mark complete'}
          style={{ borderColor: memberColor, background: complete ? memberColor : '' }}
        >
          {complete && '✓'}
        </button>
        <div className="chore-info">
          <span className="chore-name">{chore.name}</span>
          {chore.category && <span className="chore-cat">{chore.category}</span>}
        </div>
        <span className="chore-dot" style={{ background: dotColor }} title={chore.priority} />
      </div>
    </div>
  )
}
