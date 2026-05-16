import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Users2,
  Settings, LogOut, Bell, ChevronDown, Sun, Moon,
  Home, Menu, X, Trophy, History, Gamepad2, Cpu
} from 'lucide-react'
import Avatar from '../components/Avatar'
import { MOCK_USER, fmt } from '../data/mockData'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Vote Rounds', icon: Gamepad2, path: '/rounds' },
  { label: 'Deposit', icon: ArrowDownCircle, path: '/deposit' },
  { label: 'Withdrawal', icon: ArrowUpCircle, path: '/withdrawal' },
  { label: 'Referral', icon: Users2, path: '/referral' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const bottomNavItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'Deposit', icon: ArrowDownCircle, path: '/deposit' },
  { label: 'Withdraw', icon: ArrowUpCircle, path: '/withdrawal' },
  { label: 'Referral', icon: Users2, path: '/referral' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export default function DashboardLayout({ children, title }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, toggleTheme, sidebarOpen, setSidebarOpen, logout, addToast, isLoggedIn } = useStore()

  const [notifOpen, setNotifOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  const handleLogout = () => {
    logout()
    addToast('Logged out successfully', 'info')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-dark">
      {/* Sidebar backdrop on mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 bottom-0 w-60 bg-dark-2 border-r border-white/8 z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neon rounded-lg flex items-center justify-center">
              <Cpu size={15} className="text-black" />
            </div>
            <span className="font-display font-black text-lg">Vote<span className="text-neon">AI</span></span>
          </Link>
          <button className="lg:hidden btn-icon w-7 h-7" onClick={() => setSidebarOpen(false)}>
            <X size={14} />
          </button>
        </div>

        {/* User mini card */}
        <div className="mx-3 mt-4 mb-2 p-3 bg-dark-3 border border-white/8 rounded-xl">
          <div className="flex items-center gap-2.5">
            <Avatar text={MOCK_USER.avatar} size="sm" />
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{MOCK_USER.name}</div>
              <div className="text-xs text-neon font-semibold">{fmt(MOCK_USER.balance)}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-1">
          <div className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-3 py-2">Navigation</div>
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                <div className={`sidebar-item ${active ? 'active' : ''}`}>
                  <item.icon size={16} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/8">
          <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-14 bg-dark-2 border-b border-white/8 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="btn-icon lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={16} />
            </button>
            <h1 className="text-base sm:text-lg font-bold font-display truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Notif */}
            <div className="relative">
              <button className="btn-icon relative" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}>
                <Bell size={16} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 w-72 sm:w-80 bg-card-2 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/8 text-xs font-bold text-white/40 uppercase tracking-wider">Notifications</div>
                    {[
                      { icon: '🏆', text: 'You won $87.50 in Round R045!', time: '2m ago' },
                      { icon: '💰', text: 'Deposit of $500 confirmed', time: '1h ago' },
                      { icon: '👥', text: 'New referral joined: @jakeT', time: '3h ago' },
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5">
                        <div className="flex items-start gap-3">
                          <span className="text-base mt-0.5">{n.icon}</span>
                          <div className="min-w-0">
                            <div className="text-sm text-white/80">{n.text}</div>
                            <div className="text-xs text-white/30 mt-0.5">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2.5">
                      <button className="btn-ghost w-full text-xs" onClick={() => setNotifOpen(false)}>Mark all read</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button className="btn-icon hidden sm:flex" onClick={toggleTheme}>
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-dark-3 border border-white/10 rounded-lg"
              >
                <Avatar text={MOCK_USER.avatar} size="xs" />
                <span className="text-sm font-semibold hidden sm:block">{MOCK_USER.name.split(' ')[0]}</span>
                <ChevronDown size={12} className="text-white/30 hidden sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 w-48 bg-card-2 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/8">
                      <div className="text-sm font-bold">{MOCK_USER.name}</div>
                      <div className="text-xs text-white/40">{MOCK_USER.email}</div>
                    </div>
                    <Link to="/settings" onClick={() => setProfileOpen(false)}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white cursor-pointer">
                        <Settings size={14} /> Settings
                      </div>
                    </Link>
                    <div className="border-t border-white/8 my-0.5" />
                    <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={handleLogout}>
                      <LogOut size={14} /> Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-24 lg:pb-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom nav - mobile only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-2 border-t border-white/8 pb-safe">
        <div className="flex justify-around px-2">
          {bottomNavItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <div className={`flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-colors ${active ? 'text-neon' : 'text-white/30'}`}>
                  <item.icon size={20} />
                  <span className="text-[9px] font-semibold">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
