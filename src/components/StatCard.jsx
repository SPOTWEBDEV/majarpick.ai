import React from 'react'

export default function StatCard({ label, value, icon: Icon, color = '#00ff9d', change, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider">{label}</div>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
            <Icon size={15} style={{ color }} />
          </div>
        )}
      </div>
      <div className="text-2xl font-black font-display" style={{ color }}>{value}</div>
      {change && <div className="text-xs text-neon/70 mt-1">{change}</div>}
    </div>
  )
}
