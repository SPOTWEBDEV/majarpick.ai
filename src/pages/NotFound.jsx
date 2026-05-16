import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(30,144,255,0.06)_0%,transparent_60%)] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div
          className="font-display font-black leading-none mb-4"
          style={{
            fontSize: 'clamp(100px,20vw,180px)',
            background: 'linear-gradient(135deg,#00ff9d,#1e90ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-8px',
          }}
        >
          404
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-3">Page Not Found</h2>
        <p className="text-white/40 text-sm sm:text-base mb-8 max-w-sm mx-auto">
          Looks like you wandered into the wrong voting round. This page doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary px-8 py-3">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/dashboard" className="btn-ghost px-8 py-3">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
