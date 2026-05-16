import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const icons = {
  success: <CheckCircle size={16} className="text-neon" />,
  error: <XCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-yellow-400" />,
  info: <Info size={16} className="text-blue-400" />,
}

const borders = {
  success: 'border-l-neon',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-400',
  info: 'border-l-blue-400',
}

export default function Toasts() {
  const toasts = useStore(s => s.toasts)
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[90vw] sm:max-w-sm">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className={`bg-card-2 border border-white/10 border-l-4 ${borders[t.type]} rounded-xl px-4 py-3 text-sm text-white shadow-2xl flex items-center gap-3 pointer-events-auto`}
          >
            {icons[t.type]}
            <span>{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
