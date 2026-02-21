const KEYS = {
  chores: 'chore-app:chores',
  members: 'chore-app:members',
  completions: 'chore-app:completions',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadChores() {
  return load(KEYS.chores, [])
}

export function saveChores(chores) {
  save(KEYS.chores, chores)
}

export function loadMembers() {
  return load(KEYS.members, [])
}

export function saveMembers(members) {
  save(KEYS.members, members)
}

export function loadCompletions() {
  return load(KEYS.completions, [])
}

export function saveCompletions(completions) {
  save(KEYS.completions, completions)
}
