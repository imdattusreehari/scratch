import { weekDays, toDateString, today, DAY_NAMES_FULL, MONTH_NAMES } from '../utils/dates.js'
import { getOccurrences } from '../utils/recurrence.js'
import ChoreCard from './ChoreCard.jsx'

export default function WeekView({ cursor, chores, members, isComplete, onToggleComplete, onClickChore, onClickDay }) {
  const days = weekDays(cursor)
  const todayStr = today()

  const rangeStart = days[0]
  const rangeEnd = days[6]

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
    <div className="week-view">
      {days.map((day) => {
        const dateStr = toDateString(day)
        const isToday = dateStr === todayStr
        const items = dayMap[dateStr] ?? []

        return (
          <div
            key={dateStr}
            className={`week-col${isToday ? ' today' : ''}`}
            onClick={() => onClickDay(dateStr)}
          >
            <div className="week-col-header">
              <div className="week-day-name">{DAY_NAMES_FULL[day.getDay()]}</div>
              <div className={`week-day-num${isToday ? ' today-badge' : ''}`}>
                {MONTH_NAMES[day.getMonth()].slice(0, 3)} {day.getDate()}
              </div>
            </div>
            <div className="week-col-chores">
              {items.length === 0 && (
                <div className="week-empty">No chores</div>
              )}
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
  )
}
