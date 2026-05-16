import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  LayoutDashboard, Users, Gamepad2, Plus, Trophy,
  ArrowDownCircle, ArrowUpCircle, Settings, LogOut,
  Sun, Moon, Menu, X, Cpu, ShieldCheck
} from 'lucide-react'

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Rounds', icon: Gamepad2, path: '/admin/rounds' },
  { label: 'Create Round', icon: Plus, path: '/admin/create-round' },
  { label: 'Results', icon: Trophy, path: '/admin/results' },
  { label: 'Deposits', icon: ArrowDownCircle, path: '/admin/deposits' },
  { label: 'Withdrawals', icon: ArrowUpCircle, path: '/admin/withdrawals' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, toggleTheme, adminLogout, addToast } = useStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    adminLogout()
    addToast('Admin logged out', 'info')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-dark">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Admin sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-56 z-50 flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <span className="font-display font-black text-base" style={{ color: 'var(--text)' }}>Vote<span className="text-neon">AI</span></span>
          </div>
          <button className="lg:hidden btn-icon w-7 h-7" onClick={() => setSidebarOpen(false)}><X size={13} /></button>
        </div>
        <div className="mx-3 my-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Admin Panel</div>
        </div>
        <nav className="flex-1 overflow-y-auto px-1 pb-4">
          {adminNav.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                <div className={`sidebar-item ${active ? 'active' : ''}`}>
                  <item.icon size={15} /><span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} className="sidebar-item w-full" style={{ color: '#ef4444' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--bg)' }}>
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6"
          style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <button className="btn-icon lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={16} /></button>
            <h1 className="text-base sm:text-lg font-bold font-display truncate" style={{ color: 'var(--text)' }}>{title}</h1>
          </div>
          <button className="btn-icon" onClick={toggleTheme}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}