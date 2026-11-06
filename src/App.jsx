import { useState } from 'react'
import { useTracker, fmtMonth, todayStr, daysInMonth } from './lib'
import HabitList from './components/HabitList'
import MoodPicker from './components/MoodPicker'
import Charts from './components/Charts'
import Heatmap from './components/Heatmap'

export default function App() {
  const api = useTracker()
  const [month, setMonth] = useState(fmtMonth(new Date()))
  const today = todayStr()
  // Ngày đang thao tác: hôm nay nếu thuộc tháng đang xem, ngược lại ngày 1 của tháng đó
  const [pick, setPick] = useState(null)
  const date = pick && pick.startsWith(month) ? pick : today.startsWith(month) ? today : `${month}-01`
  const habits = api.habits.filter((h) => h.targetMonth === month && h.isActive)

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora w-96 h-96 bg-indigo-600 -top-20 -left-20" />
      <div className="aurora w-96 h-96 bg-fuchsia-600 top-1/3 -right-24" style={{ animationDelay: '-8s' }} />
      <div className="aurora w-96 h-96 bg-cyan-500 -bottom-24 left-1/4" style={{ animationDelay: '-15s' }} />
      <main className="relative z-10 max-w-5xl mx-auto p-4 md:p-8 space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            Habit &amp; Mood Tracker
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => e.target.value && setMonth(e.target.value)}
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm [color-scheme:dark]"
            />
            <input
              type="number"
              min={1}
              max={daysInMonth(month)}
              value={Number(date.slice(8))}
              onChange={(e) => {
                const d = Math.min(Math.max(Number(e.target.value) || 1, 1), daysInMonth(month))
                setPick(`${month}-${String(d).padStart(2, '0')}`)
              }}
              aria-label="Ngày"
              className="w-16 rounded-lg bg-white/5 border border-white/10 px-2 py-2 text-sm"
            />
          </div>
        </header>
        <div className="grid md:grid-cols-2 gap-5">
          <HabitList habits={habits} logs={api.logs} date={date} month={month} api={api} />
          <MoodPicker date={date} moods={api.moods} setMood={api.setMood} />
        </div>
        <Charts habits={habits} logs={api.logs} date={date} month={month} />
        <Heatmap moods={api.moods} month={month} date={date} />
      </main>
    </div>
  )
}
