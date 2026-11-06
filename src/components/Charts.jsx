import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { monthDays, weekOf } from '../lib'
import Tilt from './Tilt'

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const tip = { background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8 }

export default function Charts({ habits, logs, date, month }) {
  const ids = new Set(habits.map((h) => h.id))
  const count = (d) => logs.filter((l) => l.date === d && l.isCompleted && ids.has(l.habitId)).length

  const week = weekOf(date).map((d, i) => ({ name: DAYS[i], done: count(d) }))

  const days = monthDays(month)
  const weeks = []
  days.forEach((d, i) => {
    const w = Math.floor(i / 7)
    weeks[w] = weeks[w] || { name: `Tuần ${w + 1}`, done: 0, n: 0 }
    weeks[w].done += count(d)
    weeks[w].n += 1
  })
  const total = habits.length
  const monthData = weeks.map((w) => ({
    name: w.name,
    done: w.done,
    rate: total ? Math.round((w.done / (total * w.n)) * 100) : 0,
  }))
  const avg = monthData.length ? Math.round(monthData.reduce((s, w) => s + w.rate, 0) / monthData.length) : 0

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Tilt className="p-5">
        <h2 className="font-semibold text-lg mb-3">Tuần này</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={week}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" />
            <YAxis allowDecimals={false} stroke="#71717a" />
            <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
            <Bar dataKey="done" name="Hoàn thành" fill="url(#g1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Tilt>
      <Tilt className="p-5">
        <h2 className="font-semibold text-lg mb-3">Tháng · TB hoàn thành {avg}%</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthData}>
            <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" />
            <YAxis allowDecimals={false} stroke="#71717a" />
            <Tooltip contentStyle={tip} />
            <Line type="monotone" dataKey="done" name="Số task" stroke="#d946ef" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Tilt>
    </div>
  )
}
