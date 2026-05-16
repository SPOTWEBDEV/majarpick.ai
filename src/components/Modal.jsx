import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!open) return null
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            onClick={e => e.stopPropagation()}
            className={`card border-white/15 w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold font-display">{title}</h3>
              <button className="btn-icon w-8 h-8" onClick={onClose}><X size={15} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
