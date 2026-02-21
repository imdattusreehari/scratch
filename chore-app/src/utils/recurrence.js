import { fromDateString, toDateString, addDays } from './dates.js'

/**
 * Returns all occurrence date strings (YYYY-MM-DD) for a chore
 * within [rangeStart, rangeEnd] (both Date objects).
 *
 * Chore recurrence shape:
 *   { type: 'once', date: 'YYYY-MM-DD' }
 *   { type: 'daily', startDate, endDate? }
 *   { type: 'weekly', daysOfWeek: [0..6], startDate, endDate? }
 *   { type: 'monthly', dayOfMonth: 1..31, startDate, endDate? }
 */
export function getOccurrences(chore, rangeStart, rangeEnd) {
  const { recurrence } = chore

  if (recurrence.type === 'once') {
    const d = fromDateString(recurrence.date)
    if (d >= rangeStart && d <= rangeEnd) return [recurrence.date]
    return []
  }

  const choreStart = recurrence.startDate ? fromDateString(recurrence.startDate) : rangeStart
  const choreEnd = recurrence.endDate ? fromDateString(recurrence.endDate) : rangeEnd

  const effectiveStart = choreStart > rangeStart ? choreStart : rangeStart
  const effectiveEnd = choreEnd < rangeEnd ? choreEnd : rangeEnd

  if (effectiveStart > effectiveEnd) return []

  const dates = []
  let current = new Date(effectiveStart)

  while (current <= effectiveEnd) {
    if (matches(recurrence, current)) {
      dates.push(toDateString(current))
    }
    current = addDays(current, 1)
  }

  return dates
}

function matches(recurrence, date) {
  switch (recurrence.type) {
    case 'daily':
      return true
    case 'weekly':
      return (recurrence.daysOfWeek ?? []).includes(date.getDay())
    case 'monthly':
      return date.getDate() === recurrence.dayOfMonth
    default:
      return false
  }
}

/** Human-readable recurrence summary */
export function recurrenceLabel(recurrence) {
  if (!recurrence) return ''
  switch (recurrence.type) {
    case 'once':
      return `Once on ${recurrence.date}`
    case 'daily':
      return 'Every day'
    case 'weekly': {
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const selected = (recurrence.daysOfWeek ?? []).map(d => days[d]).join(', ')
      return `Weekly: ${selected || '(no days)'}`
    }
    case 'monthly':
      return `Monthly on the ${ordinal(recurrence.dayOfMonth)}`
    default:
      return ''
  }
}

function ordinal(n) {
  if (!n) return '?'
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
