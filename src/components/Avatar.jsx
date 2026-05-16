import React from 'react'

export default function Avatar({ text, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-black flex-shrink-0 ${className}`}
      style={{ background: 'linear-gradient(135deg,#00ff9d,#1e90ff)' }}
    >
      {text}
    </div>
  )
}
