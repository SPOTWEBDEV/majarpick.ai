import React from 'react'

export default function Countdown({ seconds, size = 'md' }) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  const unitCls = size === 'sm'
    ? 'bg-dark-3 border border-white/8 rounded-lg px-2.5 py-2 min-w-[44px] text-center'
    : 'bg-dark-3 border border-white/8 rounded-xl px-3 py-2.5 min-w-[52px] sm:min-w-[60px] text-center'

  const valCls = size === 'sm'
    ? 'text-xl font-black font-display text-neon leading-none'
    : 'text-2xl sm:text-3xl font-black font-display text-neon leading-none'

  const labelCls = 'text-[9px] text-white/30 uppercase tracking-widest mt-1'
  const sepCls = size === 'sm'
    ? 'text-neon font-black text-xl pb-1'
    : 'text-neon font-black text-2xl pb-1.5'

  return (
    <div className="flex items-end gap-1.5">
      <div className={unitCls}><div className={valCls}>{h}</div><div className={labelCls}>hrs</div></div>
      <div className={sepCls}>:</div>
      <div className={unitCls}><div className={valCls}>{m}</div><div className={labelCls}>min</div></div>
      <div className={sepCls}>:</div>
      <div className={unitCls}><div className={valCls}>{s}</div><div className={labelCls}>sec</div></div>
    </div>
  )
}
