import { motion } from 'framer-motion'
import { MOODS } from '../lib'
import Tilt from './Tilt'

export default function MoodPicker({ date, moods, setMood }) {
  const cur = moods.find((m) => m.date === date)
  return (
    <Tilt className="p-5">
      <h2 className="font-semibold text-lg mb-3">Tâm trạng hôm nay</h2>
      <div className="flex gap-2 justify-between">
        {[1, 2, 3, 4, 5].map((l) => {
          const on = cur?.level === l
          return (
            <motion.button
              key={l}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMood(date, l)}
              title={MOODS[l].name}
              aria-label={MOODS[l].name}
              style={on ? { background: MOODS[l].color, boxShadow: `0 0 22px ${MOODS[l].color}` } : {}}
              className={`flex-1 rounded-xl py-3 text-2xl cursor-pointer border border-white/10 ${on ? '' : 'bg-white/5 grayscale'}`}
            >
              {MOODS[l].emoji}
            </motion.button>
          )
        })}
      </div>
      <p className="text-sm text-zinc-400 mt-2 h-5">{cur ? MOODS[cur.level].name : 'Chưa ghi nhận'}</p>
      <input
        key={date}
        defaultValue={cur?.note ?? ''}
        onBlur={(e) => cur && setMood(date, undefined, e.target.value)}
        disabled={!cur}
        placeholder={cur ? 'Ghi chú ngắn về ngày hôm nay...' : 'Chọn cảm xúc trước để ghi chú'}
        className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-fuchsia-400 disabled:opacity-50"
      />
    </Tilt>
  )
}
