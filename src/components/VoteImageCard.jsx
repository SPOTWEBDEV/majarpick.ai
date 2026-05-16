import React from 'react'
import { motion } from 'framer-motion'
import { Check, Trophy } from 'lucide-react'

export default function VoteImageCard({ image, index, selected, locked, isWinner, onSelect, showVotes = false }) {
  const totalVotes = image.votes
  const maxVotes = 5000
  const pct = Math.round((totalVotes / maxVotes) * 100)

  const handleClick = () => {
    if (!locked && onSelect) onSelect(index)
  }

  return (
    <motion.div
      whileHover={!locked ? { scale: 1.03 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      onClick={handleClick}
      className={`
        relative rounded-2xl overflow-hidden aspect-square cursor-pointer
        border-2 transition-all duration-300
        ${selected ? 'border-neon shadow-[0_0_24px_rgba(0,255,157,0.35)]' : 'border-white/10'}
        ${isWinner ? '!border-yellow-400 shadow-[0_0_32px_rgba(255,215,0,0.3)]' : ''}
        ${locked && !selected ? 'opacity-50 cursor-default' : ''}
      `}
      style={{ background: image.bg }}
    >
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 sm:p-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
          className="text-4xl sm:text-5xl drop-shadow-lg filter"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
        >
          {image.emoji}
        </motion.div>
        <div className="text-center">
          <div className="text-white font-bold text-xs sm:text-sm font-display" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {image.label}
          </div>
          <div className="text-white/50 text-[10px] sm:text-xs mt-0.5">{image.desc}</div>
        </div>
        {showVotes && (
          <div className="w-full mt-1">
            <div className="flex justify-between text-[10px] text-white/40 mb-1">
              <span>{image.votes.toLocaleString()} votes</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: image.color }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selected badge */}
      {selected && !isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-neon rounded-full flex items-center justify-center shadow-lg"
        >
          <Check size={13} className="text-black" strokeWidth={3} />
        </motion.div>
      )}

      {/* Winner badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg"
        >
          <Trophy size={14} className="text-black" />
        </motion.div>
      )}

      {/* YOUR VOTE tag */}
      {selected && !isWinner && (
        <div className="absolute bottom-0 left-0 right-0 bg-neon/90 py-1 text-center text-[10px] font-bold text-black uppercase tracking-widest">
          Your Vote
        </div>
      )}
    </motion.div>
  )
}
