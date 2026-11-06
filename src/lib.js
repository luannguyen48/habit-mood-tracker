import { useEffect, useState } from 'react'

export const MOODS = {
  5: { name: 'Rất vui', color: '#10B981', emoji: '😄' },
  4: { name: 'Vui', color: '#34D399', emoji: '🙂' },
  3: { name: 'Trung bình', color: '#FBBF24', emoji: '😐' },
  2: { name: 'Không vui', color: '#F97316', emoji: '😕' },
  1: { name: 'Thấp', color: '#EF4444', emoji: '😫' },
}
export const NO_MOOD = '#374151'
export const CATEGORIES = ['Sức khỏe', 'Công việc', 'Phát triển bản thân', 'Tài chính', 'Khác']

const pad = (n) => String(n).padStart(2, '0')
export const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fmtMonth = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
export const todayStr = () => fmtDate(new Date())
export const daysInMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}
export const monthDays = (ym) =>
  Array.from({ length: daysInMonth(ym) }, (_, i) => `${ym}-${pad(i + 1)}`)
// Thứ trong tuần, Thứ Hai = 0 ... Chủ Nhật = 6
export const weekdayIdx = (dateStr) => (new Date(dateStr + 'T00:00:00').getDay() + 6) % 7
export const displayDate = (s) => s.split('-').reverse().join('/')
export const weekOf = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() - weekdayIdx(dateStr))
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    return fmtDate(x)
  })
}
export const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)

function usePersisted(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v))
  }, [key, v])
  return [v, setV]
}

export function useTracker() {
  const [habits, setHabits] = usePersisted('hm.habits', [])
  const [logs, setLogs] = usePersisted('hm.logs', [])
  const [moods, setMoods] = usePersisted('hm.moods', [])

  const addHabit = (title, category, targetMonth) => {
    const t = title.trim()
    if (!t) return false
    setHabits((h) => [
      ...h,
      { id: uid(), title: t, category, targetMonth, createdAt: Date.now(), isActive: true },
    ])
    return true
  }
  const removeHabit = (id) => {
    const hasLogs = logs.some((l) => l.habitId === id && l.isCompleted)
    if (hasLogs) setHabits((h) => h.map((x) => (x.id === id ? { ...x, isActive: false } : x)))
    else {
      setHabits((h) => h.filter((x) => x.id !== id))
      setLogs((l) => l.filter((x) => x.habitId !== id))
    }
  }
  const toggleLog = (date, habitId) =>
    setLogs((l) => {
      const i = l.findIndex((x) => x.date === date && x.habitId === habitId)
      if (i < 0) return [...l, { date, habitId, isCompleted: true }]
      return l.map((x, j) => (j === i ? { ...x, isCompleted: !x.isCompleted } : x))
    })
  const setMood = (date, level, note) =>
    setMoods((m) => {
      const old = m.find((x) => x.date === date)
      const entry = { date, level: level ?? old?.level, note: note ?? old?.note ?? '' }
      return old ? m.map((x) => (x.date === date ? entry : x)) : [...m, entry]
    })

  return { habits, logs, moods, addHabit, removeHabit, toggleLog, setMood }
}
