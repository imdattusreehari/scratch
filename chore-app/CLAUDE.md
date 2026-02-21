# Office Chore Manager

A browser-based calendar app for managing and tracking recurring office chores. Team members can be assigned chores, chores can recur on a schedule, and individual occurrences can be marked complete.

## Tech Stack

- **React 18** (functional components, hooks) + **Vite 5**
- **Vanilla CSS** — single stylesheet at `src/App.css`, no CSS framework
- **localStorage** — all persistence, no backend or build-time config needed
- No routing library, no state management library, no test framework

## Commands

```bash
npm install       # first-time setup
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Project Structure

```
src/
  App.jsx                  # Root component; owns all state (chores, members, completions)
  App.css                  # All styles
  components/
    CalendarHeader.jsx     # Nav bar: prev/next, today, month/week toggle
    MonthView.jsx          # 7×N grid calendar
    WeekView.jsx           # 7-column weekly layout
    ChoreCard.jsx          # Single chore pill (check button, priority dot, member color)
    ChoreFormModal.jsx     # Add/edit chore form (name, recurrence, assignee, priority, category)
    TeamPanel.jsx          # Add/remove team members
  utils/
    dates.js               # Pure date helpers (no external lib): grid generation, formatting
    recurrence.js          # Expands a chore's recurrence rule into occurrence date strings
    storage.js             # Thin localStorage wrappers (load/save for chores, members, completions)
```

## Data Model

All data lives in `localStorage` under the `chore-app:*` namespace.

**Chore**
```js
{
  id: string,
  name: string,
  description: string,
  priority: 'low' | 'medium' | 'high',
  category: string,
  assignedTo: string | null,          // member id
  recurrence: {
    type: 'once' | 'daily' | 'weekly' | 'monthly',
    date?: 'YYYY-MM-DD',             // once
    daysOfWeek?: number[],           // weekly (0=Sun … 6=Sat)
    dayOfMonth?: number,             // monthly
    startDate?: 'YYYY-MM-DD',        // recurring
    endDate?: 'YYYY-MM-DD' | null,   // recurring, optional
  }
}
```

**Member** — `{ id, name, color }` (color auto-assigned from a fixed palette)

**Completion** — `{ choreId, date: 'YYYY-MM-DD' }` (one record per completed occurrence)

## Key Conventions

- **Date strings** are always `YYYY-MM-DD`; `Date` objects are only used internally in `dates.js`.
- **Recurrence expansion** (`utils/recurrence.js → getOccurrences`) iterates day-by-day over the visible range — keep queried ranges small (≤ ~6 weeks).
- State is lifted entirely into `App.jsx`. Pass handlers down as props; no context or global store.
- IDs are generated with `Math.random().toString(36) + Date.now().toString(36)`.
