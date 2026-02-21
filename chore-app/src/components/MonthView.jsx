import { calendarGridDays, toDateString, today, DAY_NAMES, MONTH_NAMES } from '../utils/dates.js'
import { getOccurrences } from '../utils/recurrence.js'
import ChoreCard from './ChoreCard.jsx'

export default function MonthView({ cursor, chores, members, isComplete, onToggleComplete, onClickChore, onClickDay }) {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const days = calendarGridDays(year, month)
  const todayStr = today()

  const rangeStart = days[0]
  const rangeEnd = days[days.length - 1]

  // Build a map: dateStr -> [{ chore, member }]
  const dayMap = {}
  for (const chore of chores) {
    const occurrences = getOccurrences(chore, rangeStart, rangeEnd)
    const member = members.find(m => m.id === chore.assignedTo) ?? null
    for (const date of occurrences) {
      if (!dayMap[date]) dayMap[date] = []
      dayMap[date].push({ chore, member })
    }
  }

  return (
    <div className="month-view">
      <div className="month-grid-header">
        {DAY_NAMES.map(d => <div key={d} className="month-day-name">{d}</div>)}
      </div>
      <div className="month-grid">
        {days.map((day) => {
          const dateStr = toDateString(day)
          const isCurrentMonth = day.getMonth() === month
          const isToday = dateStr === todayStr
          const items = dayMap[dateStr] ?? []

          return (
            <div
              key={dateStr}
              className={`month-cell${isCurrentMonth ? '' : ' other-month'}${isToday ? ' today' : ''}`}
              onClick={() => onClickDay(dateStr)}
            >
              <div className="month-cell-header">
                <span className={`day-num${isToday ? ' today-badge' : ''}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="month-cell-chores">
                {items.map(({ chore, member }) => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    member={member}
                    complete={isComplete(chore.id, dateStr)}
                    onToggle={() => onToggleComplete(chore.id, dateStr)}
                    onClick={onClickChore}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
