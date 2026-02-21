/** Format a Date as YYYY-MM-DD */
export function toDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse YYYY-MM-DD into a local Date at midnight */
export function fromDateString(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Add N days to a Date, returns new Date */
export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/** Start of the week (Sunday) containing date */
export function startOfWeek(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  return d
}

/** Start of the month containing date */
export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/** End of the month containing date */
export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/** All days in the calendar grid for a month view (fills leading/trailing week days) */
export function calendarGridDays(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days = []
  // leading days from previous month
  for (let i = 0; i < first.getDay(); i++) {
    days.push(addDays(first, i - first.getDay()))
  }
  // days in month
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  // trailing days to fill last row
  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      days.push(addDays(last, i))
    }
  }
  return days
}

/** Array of 7 Date objects for the week containing `date` */
export function weekDays(date) {
  const sunday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i))
}

/** Month name */
export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
export const DAY_NAMES_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

/** Today as YYYY-MM-DD */
export function today() {
  return toDateString(new Date())
}
