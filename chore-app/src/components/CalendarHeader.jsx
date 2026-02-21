import { MONTH_NAMES, addDays, startOfWeek, weekDays, today, toDateString } from '../utils/dates.js'

function monthLabel(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

function weekLabel(date) {
  const days = weekDays(date)
  const first = days[0]
  const last = days[6]
  if (first.getMonth() === last.getMonth()) {
    return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()}–${last.getDate()}, ${first.getFullYear()}`
  }
  return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`
}

export default function CalendarHeader({ view, cursor, onViewChange, onCursorChange }) {
  function goToday() {
    onCursorChange(new Date())
  }

  function goPrev() {
    if (view === 'month') {
      onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
    } else {
      onCursorChange(addDays(cursor, -7))
    }
  }

  function goNext() {
    if (view === 'month') {
      onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
    } else {
      onCursorChange(addDays(cursor, 7))
    }
  }

  const label = view === 'month' ? monthLabel(cursor) : weekLabel(cursor)

  return (
    <div className="cal-header">
      <div className="cal-nav">
        <button className="btn btn-ghost" onClick={goToday}>Today</button>
        <button className="btn btn-ghost icon-btn" onClick={goPrev} aria-label="Previous">‹</button>
        <button className="btn btn-ghost icon-btn" onClick={goNext} aria-label="Next">›</button>
        <span className="cal-label">{label}</span>
      </div>
      <div className="view-toggle">
        <button
          className={`btn btn-ghost${view === 'month' ? ' active' : ''}`}
          onClick={() => onViewChange('month')}
        >
          Month
        </button>
        <button
          className={`btn btn-ghost${view === 'week' ? ' active' : ''}`}
          onClick={() => onViewChange('week')}
        >
          Week
        </button>
      </div>
    </div>
  )
}
