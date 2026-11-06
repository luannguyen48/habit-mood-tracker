import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Trash2 } from 'lucide-react'
import { CATEGORIES } from '../lib'
import Tilt from './Tilt'

function Box({ done, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      animate={{ scale: done ? [1, 1.35, 1] : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      onClick={onClick}
      aria-label="Đánh dấu hoàn thành"
      className={`relative size-7 shrink-0 rounded-lg border grid place-items-center cursor-pointer ${
        done ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_18px_#10B981]' : 'border-white/20 bg-white/5'
      }`}
    >
      {done && <Check size={16} className="text-white" />}
      <AnimatePresence>
        {done && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-emerald-400/60 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function HabitList({ habits, logs, date, month, api }) {
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState(CATEGORIES[0])
  const [err, setErr] = useState('')
  const isDone = (id) => logs.some((l) => l.date === date && l.habitId === id && l.isCompleted)
  const doneCount = habits.filter((h) => isDone(h.id)).length
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0
  const add = (e) => {
    e.preventDefault()
    if (!api.addHabit(title, cat, month)) return setErr('Tên thói quen không được để trống')
    setTitle('')
    setErr('')
  }
  const del = (h) => {
    if (confirm('Bạn có chắc muốn xóa thói quen này khỏi tháng này không?')) api.removeHabit(h.id)
  }
  return (
    <Tilt className="p-5">
      <div className="flex justify-between items-baseline mb-2">
        <h2 className="font-semibold text-lg">Hôm nay · {date.split('-').reverse().join('/')}</h2>
        <span className="text-sm text-zinc-400">{doneCount}/{habits.length} tasks · {pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_14px_#10B981]"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />
      </div>
      <ul className="space-y-2">
        {habits.map((h) => (
          <li key={h.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
            <Box done={isDone(h.id)} onClick={() => api.toggleLog(date, h.id)} />
            <span className={`flex-1 transition-all ${isDone(h.id) ? 'line-through text-zinc-500' : ''}`}>
              {h.title}
              <em className="ml-2 text-xs not-italic text-zinc-500">{h.category}</em>
            </span>
            <button onClick={() => del(h)} aria-label="Xóa" className="text-zinc-500 hover:text-red-400 cursor-pointer">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {!habits.length && <li className="text-sm text-zinc-500">Chưa có mục tiêu nào trong tháng này.</li>}
      </ul>
      <form onSubmit={add} className="mt-4 flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên thói quen..."
          className="flex-1 min-w-40 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-fuchsia-400"
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg bg-slate-900 border border-white/10 px-2 text-sm">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="flex items-center gap-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 px-3 py-2 text-sm cursor-pointer">
          <Plus size={16} /> Thêm mục tiêu
        </button>
        {err && <p className="w-full text-sm text-red-400">{err}</p>}
      </form>
    </Tilt>
  )
}
