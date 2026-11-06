import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOODS, NO_MOOD, monthDays, weekdayIdx, displayDate, weekOf, fmtDate } from '../lib'
import Tilt from './Tilt'

function Cell({ date, mood, size, onHover }) {
  const color = mood ? MOODS[mood.level].color : NO_MOOD
  return (
    <div
      onMouseEnter={(e) => onHover({ date, mood, x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => onHover({ date, mood, x: e.clientX, y: e.clientY })}
      onMouseLeave={() => onHover(null)}
      style={{ background: color, width: size, height: size, opacity: mood ? 1 : 0.5 }}
      className="rounded-md"
    />
  )
}

export default function Heatmap({ moods, month, date }) {
  const [view, setView] = useState('month')
  const [hover, setHover] = useState(null)
  const get = (d) => moods.find((m) => m.date === d)
  const year = month.slice(0, 4)

  let body
  if (view === 'week') {
    body = (
      <div className="flex gap-2">
        {weekOf(date).map((d) => <Cell key={d} date={d} mood={get(d)} size={44} onHover={setHover} />)}
      </div>
    )
  } else if (view === 'month') {
    const days = monthDays(month)
    const pad = weekdayIdx(days[0])
    body = (
      <div>
        <div className="grid grid-cols-7 gap-1.5 w-fit mb-1.5 text-xs text-zinc-500">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((x) => <span key={x} className="w-9 text-center">{x}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5 w-fit">
          {Array.from({ length: pad }, (_, i) => <span key={'p' + i} />)}
          {days.map((d) => <Cell key={d} date={d} mood={get(d)} size={36} onHover={setHover} />)}
        </div>
      </div>
    )
  } else {
    // Cả năm / quý: lưới 7 hàng x ~53 cột kiểu GitHub
    const start = new Date(`${year}-01-01T00:00:00`)
    const offset = weekdayIdx(fmtDate(start))
    const days = []
    for (let d = new Date(start); d.getFullYear() === Number(year); d.setDate(d.getDate() + 1)) days.push(fmtDate(d))
    const cols = Math.ceil((offset + days.length) / 7)
    const cells = [...Array(offset).fill(null), ...days]
    body = (
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-fit" style={{ gridTemplateColumns: `repeat(${cols}, 14px)` }}>
          {cells.map((d, i) => (d ? <Cell key={d} date={d} mood={get(d)} size={14} onHover={setHover} /> : <span key={'e' + i} />))}
        </div>
      </div>
    )
  }

  return (
    <Tilt className="p-5">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="font-semibold text-lg">Bản đồ nhiệt cảm xúc</h2>
        <div className="flex gap-1 text-sm">
          {[['week', 'Tuần'], ['month', 'Tháng'], ['year', `Năm ${year}`]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`px-3 py-1 rounded-lg cursor-pointer ${view === k ? 'bg-indigo-500' : 'bg-white/5 hover:bg-white/10'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {body}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-zinc-400">
        {[5, 4, 3, 2, 1].map((l) => (
          <span key={l} className="flex items-center gap-1">
            <i className="size-3 rounded-sm" style={{ background: MOODS[l].color }} /> {MOODS[l].name}
          </span>
        ))}
        <span className="flex items-center gap-1"><i className="size-3 rounded-sm" style={{ background: NO_MOOD }} /> Chưa ghi</span>
      </div>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', left: hover.x + 12, top: hover.y + 12, zIndex: 50 }}
            className="pointer-events-none rounded-lg bg-slate-900 border border-white/15 px-3 py-2 text-xs shadow-xl max-w-64"
          >
            Ngày {displayDate(hover.date)} - Cảm xúc: {hover.mood ? MOODS[hover.mood.level].name : 'Chưa ghi nhận'}
            {hover.mood?.note ? ` - Ghi chú: ${hover.mood.note}` : ''}
          </motion.div>
        )}
      </AnimatePresence>
    </Tilt>
  )
}
