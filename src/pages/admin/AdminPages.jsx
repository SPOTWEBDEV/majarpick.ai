import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { authApi, adminApi } from '../../services/api'
import { fmt, fmtDate } from '../../data/mockData'
import AdminLayout from '../../layouts/AdminLayout'
import Avatar from '../../components/Avatar'
import VoteImageCard from '../../components/VoteImageCard'
import {
  Users, Gamepad2, ArrowDownCircle, ArrowUpCircle, DollarSign,
  ShieldCheck, Cpu, Eye, Ban, CheckCircle, XCircle, Plus, Upload,
  Loader2, RefreshCw, Search, TrendingUp, AlertTriangle
} from 'lucide-react'

// ── Shared helpers ────────────────────────────────────────────
const TH = ({ cols }) => (
  <thead>
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      {cols.map(h => (
        <th key={h} className="text-left pb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text4)' }}>{h}</th>
      ))}
    </tr>
  </thead>
)

const SkeletonRows = ({ n = 4, cols = 6 }) => (
  <>
    {Array(n).fill(0).map((_, i) => (
      <tr key={i}>
        {Array(cols).fill(0).map((_, j) => (
          <td key={j} className="py-3 pr-4">
            <div className="skeleton h-5 rounded" style={{ width: `${50 + Math.random() * 40}%` }} />
          </td>
        ))}
      </tr>
    ))}
  </>
)

const EmptyState = ({ icon = '📭', message = 'No data found' }) => (
  <tr>
    <td colSpan={99} className="py-12 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm" style={{ color: 'var(--text4)' }}>{message}</div>
    </td>
  </tr>
)

const StatCard = ({ label, value, icon: Icon, color, change }) => (
  <div className="card">
    <div className="flex items-start justify-between mb-3">
      <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text4)' }}>{label}</div>
      {Icon && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Icon size={15} style={{ color }} />
        </div>
      )}
    </div>
    <div className="font-display font-black text-2xl sm:text-3xl mb-1" style={{ color }}>{value ?? '—'}</div>
    {change && <div className="text-xs" style={{ color: 'var(--text4)' }}>{change}</div>}
  </div>
)

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────
export function AdminLogin() {
  const navigate  = useNavigate()
  const { adminLoginSuccess, addToast } = useStore()
  const [fields,  setFields]  = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setFields(p => ({ ...p, [k]: v }))

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!fields.email || !fields.password) { setError('Email and password are required'); return }
    setError('')
    setLoading(true)
    try {
      const res = await authApi.adminLogin({ email: fields.email, password: fields.password })
      adminLoginSuccess(res.data.admin, res.data.token)
      addToast('Admin access granted ✅', 'success')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(239,68,68,0.08) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>
              Vote<span className="text-neon">AI</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-red-500/15 border border-red-500/25 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider">
            <ShieldCheck size={11} /> Admin Panel
          </div>
        </div>

        <div className="card p-7">
          <h2 className="font-display font-black text-xl mb-1" style={{ color: 'var(--text)' }}>Admin Login</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>Restricted access — authorized personnel only</p>
          {error && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <input className="input" type="email" placeholder="admin@voteai.io"
                value={fields.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={fields.password} onChange={e => set('password', e.target.value)} />
            </div>
            <button type="submit" disabled={loading}
              className="btn-danger w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                : <><ShieldCheck size={16} /> Access Admin Panel</>}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs hover:underline" style={{ color: 'var(--text4)' }}>← Back to site</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.dashboard()
      .then(r => setStats(r?.data?.stats || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Revenue bar chart from real data
  const revenue7d = stats?.revenue_7d || []
  const maxRev    = Math.max(...revenue7d.map(d => parseFloat(d.amount) || 0), 1)

  const statCards = stats ? [
    { label: 'Total Users',   value: stats.total_users?.toLocaleString(),    icon: Users,          color: '#60a5fa', change: `${stats.active_users} active` },
    { label: 'Active Rounds', value: stats.active_rounds,                    icon: Gamepad2,       color: '#00ff9d', change: `${stats.total_rounds} total` },
    { label: 'Total Deposits',value: fmt(stats.total_deposits || 0),         icon: ArrowDownCircle,color: '#fbbf24', change: `${stats.pending_deposits} pending` },
    { label: 'Revenue',       value: fmt(stats.platform_revenue || 0),       icon: DollarSign,     color: '#a78bfa', change: 'Platform earnings' },
  ] : []

  return (
    <AdminLayout title="Dashboard Overview">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {Array(4).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-24 rounded-xl" /></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="card">
          <h3 className="font-display font-bold text-sm mb-5" style={{ color: 'var(--text)' }}>Deposits — Last 7 Days</h3>
          {loading ? (
            <div className="skeleton h-28 rounded-xl" />
          ) : revenue7d.length === 0 ? (
            <div className="flex items-center justify-center h-28 text-sm" style={{ color: 'var(--text4)' }}>No data yet</div>
          ) : (
            <div className="flex items-end gap-2 h-28">
              {revenue7d.map((d, i) => {
                const h = Math.max(8, Math.round((parseFloat(d.amount) / maxRev) * 80))
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-bold" style={{ color: 'var(--text4)' }}>${Math.round(parseFloat(d.amount))}</div>
                    <div className="w-full rounded-t-md" style={{ height: `${h}px`, background: 'linear-gradient(180deg,#00ff9d,#1e90ff)' }} />
                    <div className="text-[9px]" style={{ color: 'var(--text4)' }}>
                      {new Date(d.day).toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card">
          <h3 className="font-display font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Recent Activity</h3>
          {loading ? (
            <div className="space-y-2">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-9 rounded-lg" />)}</div>
          ) : (stats?.recent_activity || []).length === 0 ? (
            <div className="text-sm text-center py-4" style={{ color: 'var(--text4)' }}>No activity yet</div>
          ) : (
            <div className="space-y-0">
              {(stats?.recent_activity || []).map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-base">
                    {a.event === 'user_registered' ? '👤' : a.event === 'deposit' ? '💰' : '🏆'}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: 'var(--text2)' }}>{a.label}</span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text4)' }}>
                    {new Date(a.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      {!loading && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Withdrawals',    val: fmt(stats.total_withdrawals || 0),   color: '#f87171' },
            { label: 'Pending Deposits',     val: stats.pending_deposits || 0,          color: '#fbbf24' },
            { label: 'Pending Withdrawals',  val: stats.pending_withdrawals || 0,       color: '#fb923c' },
            { label: 'Total Votes',          val: (stats.total_votes || 0).toLocaleString(), color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} className="card text-center py-3">
              <div className="font-display font-black text-xl sm:text-2xl" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] uppercase tracking-wide mt-1" style={{ color: 'var(--text4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────────────────────
export function AdminUsers() {
  const { addToast } = useStore()
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [page,     setPage]     = useState(1)
  const [meta,     setMeta]     = useState(null)
  const searchRef  = useRef(null)

  const fetchUsers = useCallback((s = search, st = status, p = page) => {
    setLoading(true)
    const params = { page: p, per_page: 20 }
    if (s)  params.search = s
    if (st) params.status = st
    adminApi.users(params)
      .then(r => { setUsers(r?.data?.users || []); setMeta(r?.data?.meta || null) })
      .catch(() => addToast('Could not load users', 'error'))
      .finally(() => setLoading(false))
  }, [search, status, page])

  useEffect(() => { fetchUsers('', '', 1) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers(search, status, 1)
  }

  const handleStatusFilter = (s) => { setStatus(s); setPage(1); fetchUsers(search, s, 1) }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    try {
      await adminApi.updateUserStatus(user.id, newStatus)
      addToast(`@${user.username} ${newStatus === 'active' ? 'activated' : 'suspended'}`, newStatus === 'active' ? 'success' : 'warning')
      fetchUsers(search, status, page)
    } catch (err) { addToast(err.message || 'Action failed', 'error') }
  }

  return (
    <AdminLayout title="All Users">
      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
            Users {meta ? `(${meta.total})` : ''}
          </div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
              <input ref={searchRef} className="input text-sm py-2 pl-8 w-full sm:w-48"
                placeholder="Search users..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </form>
            <select className="input text-sm py-2" style={{ width: 'auto' }}
              value={status} onChange={e => handleStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="btn-ghost text-xs" onClick={() => fetchUsers(search, status, page)}>
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[680px]">
            <TH cols={['User', 'Email', 'Balance', 'Votes', 'Wins', 'Status', 'Joined', 'Actions']} />
            <tbody>
              {loading
                ? <SkeletonRows n={5} cols={8} />
                : users.length === 0
                  ? <EmptyState icon="👥" message="No users found" />
                  : users.map(u => (
                    <tr key={u.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar text={(u.username || 'U').slice(0, 2).toUpperCase()} size="xs" />
                          <div>
                            <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>@{u.username}</div>
                            <div className="text-[10px]" style={{ color: 'var(--text4)' }}>{u.level}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text3)' }}>{u.email}</td>
                      <td className="py-3 font-bold text-neon">{fmt(u.balance || 0)}</td>
                      <td className="py-3" style={{ color: 'var(--text2)' }}>{u.total_votes || 0}</td>
                      <td className="py-3" style={{ color: 'var(--text2)' }}>{u.win_count || 0}</td>
                      <td className="py-3">
                        <span className={u.status === 'active' ? 'badge-green' : u.status === 'suspended' ? 'badge-red' : 'badge-blue'}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(u.created_at)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="btn-icon w-7 h-7" title="View"
                            onClick={() => addToast(`Viewing @${u.username}`, 'info')}>
                            <Eye size={12} />
                          </button>
                          <button
                            className="btn-icon w-7 h-7"
                            style={{ color: u.status === 'active' ? '#f87171' : 'var(--neon)' }}
                            title={u.status === 'active' ? 'Suspend' : 'Activate'}
                            onClick={() => handleToggleStatus(u)}>
                            {u.status === 'active' ? <Ban size={12} /> : <CheckCircle size={12} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => { setPage(p); fetchUsers(search, status, p) }}
                className="min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors border"
                style={{
                  background: p === page ? 'var(--neon)' : 'transparent',
                  color: p === page ? '#000' : 'var(--text4)',
                  borderColor: p === page ? 'var(--neon)' : 'var(--border)',
                }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN ROUNDS
// ─────────────────────────────────────────────────────────────
export function AdminRounds() {
  const { addToast } = useStore()
  const [rounds,  setRounds]  = useState([])
  const [loading, setLoading] = useState(true)
  const [status,  setStatus]  = useState('')

  const fetchRounds = (s = '') => {
    setLoading(true)
    adminApi.rounds(s ? { status: s } : {})
      .then(r => setRounds(r?.data?.rounds || []))
      .catch(() => addToast('Could not load rounds', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRounds() }, [])

  const handleCancel = async (roundId, code) => {
    if (!window.confirm(`Cancel round ${code}?`)) return
    try {
      await adminApi.updateRoundStatus(roundId, 'cancelled')
      addToast(`Round ${code} cancelled`, 'warning')
      fetchRounds(status)
    } catch (err) { addToast(err.message || 'Failed', 'error') }
  }

  return (
    <AdminLayout title="All Rounds">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['', 'live', 'upcoming', 'ended', 'cancelled'].map(s => (
            <button key={s} onClick={() => { setStatus(s); fetchRounds(s) }}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${status === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs" onClick={() => fetchRounds(status)}><RefreshCw size={13} /></button>
          <Link to="/admin/create-round" className="btn-primary text-sm"><Plus size={14} /> New Round</Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-56 rounded-xl" /></div>)}
        </div>
      ) : rounds.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-4xl mb-3">🎮</div>
          <div className="font-display font-bold text-base mb-2" style={{ color: 'var(--text)' }}>No rounds found</div>
          <Link to="/admin/create-round" className="btn-primary text-sm mt-3 inline-flex"><Plus size={14} /> Create First Round</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rounds.map((round, i) => (
            <div key={i} className="card">
              <div className="flex justify-between items-center mb-3">
                <span className={round.status === 'live' ? 'badge-green' : round.status === 'upcoming' ? 'badge-yellow' : round.status === 'cancelled' ? 'badge-red' : 'badge-blue'}>
                  {round.status === 'live' ? '🔴' : round.status === 'upcoming' ? '🟡' : round.status === 'cancelled' ? '❌' : '✅'} {round.status}
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text4)' }}>{round.round_code}</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>{round.theme}</h3>
              <div className="flex justify-between text-xs mb-3" style={{ color: 'var(--text3)' }}>
                <span>Prize: <strong className="text-neon">{fmt(round.prize_pool)}</strong></span>
                <span>{(round.total_voters || 0).toLocaleString()} voters</span>
              </div>
              {(round.images || []).length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {round.images.map((img, j) => (
                    <VoteImageCard key={img.id} image={{
                      id: img.id, label: img.label, emoji: img.emoji || '🖼️',
                      desc: img.description, votes: img.vote_count || 0,
                      color: img.color || '#00ff9d',
                      bg: img.bg_gradient || 'linear-gradient(135deg,#1a1a2e,#16213e)'
                    }} index={j} locked
                      isWinner={round.status === 'ended' && round.winner_image_id === img.id} />
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn-ghost flex-1 text-xs py-1.5"
                  onClick={() => addToast(`Round ${round.round_code}: ${round.total_votes || 0} total votes`, 'info')}>
                  Details
                </button>
                {round.status !== 'ended' && round.status !== 'cancelled' && (
                  <button className="btn-danger text-xs py-1.5 px-3"
                    onClick={() => handleCancel(round.id, round.round_code)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN CREATE ROUND
// ─────────────────────────────────────────────────────────────
export function AdminCreateRound() {
  const { addToast } = useStore()
  const navigate = useNavigate()
  const [loading,   setLoading]   = useState(false)
  const [uploading, setUploading] = useState([false, false, false])
  const [fields,    setFields]    = useState({
    theme: '', prize_pool: '', duration_minutes: '10', starts_at: '',
  })
  const [images, setImages] = useState([
    { label: '', description: '', emoji: '', image_url: '', color: '#ff4757', bg_gradient: 'linear-gradient(135deg,#1a0505,#3d0808)' },
    { label: '', description: '', emoji: '', image_url: '', color: '#7c3aed', bg_gradient: 'linear-gradient(135deg,#0d0820,#1e1040)' },
    { label: '', description: '', emoji: '', image_url: '', color: '#94a3b8', bg_gradient: 'linear-gradient(135deg,#0a0a0f,#1a1a25)' },
  ])
  const fileRefs = [useRef(), useRef(), useRef()]

  const setField = (k, v) => setFields(p => ({ ...p, [k]: v }))
  const setImg   = (i, k, v) => setImages(p => p.map((img, idx) => idx === i ? { ...img, [k]: v } : img))

  const handleImageUpload = async (file, idx) => {
    setUploading(p => p.map((v, i) => i === idx ? true : v))
    try {
      const res = await adminApi.uploadImage(file)
      if (res?.data?.url) {
        setImg(idx, 'image_url', res.data.url)
        addToast(`Image ${idx + 1} uploaded!`, 'success')
      }
    } catch (err) { addToast(err.message || 'Upload failed', 'error') }
    finally { setUploading(p => p.map((v, i) => i === idx ? false : v)) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!fields.theme || !fields.prize_pool || !fields.starts_at)
      return addToast('Theme, prize amount and start time are required', 'warning')
    if (images.some(img => !img.label))
      return addToast('All 3 image labels are required', 'warning')

    setLoading(true)
    try {
      const startDt = new Date(fields.starts_at)
      const endDt   = new Date(startDt.getTime() + parseInt(fields.duration_minutes) * 60000)
      await adminApi.createRound({
        theme:      fields.theme,
        prize_pool: parseFloat(fields.prize_pool),
        starts_at:  startDt.toISOString().slice(0, 19).replace('T', ' '),
        ends_at:    endDt.toISOString().slice(0, 19).replace('T', ' '),
        images,
      })
      addToast('Round created successfully! 🎮', 'success')
      navigate('/admin/rounds')
    } catch (err) { addToast(err.message || 'Could not create round', 'error') }
    finally { setLoading(false) }
  }

  return (
    <AdminLayout title="Create New Round">
      <div className="max-w-2xl">
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Basic info */}
            <div>
              <label className="label">Round Theme / Title</label>
              <input className="input" placeholder="e.g. Scary Creatures #48"
                value={fields.theme} onChange={e => setField('theme', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prize Pool ($)</label>
                <input className="input" type="number" placeholder="500" min="10"
                  value={fields.prize_pool} onChange={e => setField('prize_pool', e.target.value)} />
              </div>
              <div>
                <label className="label">Duration (minutes)</label>
                <input className="input" type="number" placeholder="10" min="1"
                  value={fields.duration_minutes} onChange={e => setField('duration_minutes', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Start Date & Time</label>
              <input className="input" type="datetime-local"
                value={fields.starts_at} onChange={e => setField('starts_at', e.target.value)} />
            </div>

            {/* 3 images */}
            <div>
              <label className="label">3 AI Images</label>
              <div className="space-y-4">
                {images.map((img, idx) => (
                  <div key={idx} className="rounded-xl p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-neon flex items-center justify-center text-black text-xs font-black">{idx + 1}</div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Image {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="label">Label *</label>
                        <input className="input text-sm" placeholder="e.g. Shadow Beast"
                          value={img.label} onChange={e => setImg(idx, 'label', e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Emoji</label>
                        <input className="input text-sm" placeholder="👹"
                          value={img.emoji} onChange={e => setImg(idx, 'emoji', e.target.value)} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="label">Description</label>
                      <input className="input text-sm" placeholder="Short description..."
                        value={img.description} onChange={e => setImg(idx, 'description', e.target.value)} />
                    </div>
                    {/* Upload */}
                    <input ref={fileRefs[idx]} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, idx) }} />
                    <div
                      onClick={() => fileRefs[idx].current?.click()}
                      className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all aspect-video"
                      style={{
                        border: '2px dashed var(--border2)',
                        background: img.image_url ? 'none' : 'var(--bg)',
                      }}>
                      {uploading[idx] ? (
                        <><Loader2 size={20} className="animate-spin text-neon" /><span className="text-xs" style={{ color: 'var(--text3)' }}>Uploading...</span></>
                      ) : img.image_url ? (
                        <img src={img.image_url} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <><Upload size={20} style={{ color: 'var(--text4)' }} /><span className="text-xs" style={{ color: 'var(--text4)' }}>Click to upload image</span></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Creating...</>
                  : <><Gamepad2 size={15} /> Create Round</>}
              </button>
              <button type="button" className="btn-ghost px-5" onClick={() => navigate('/admin/rounds')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN RESULTS — Publish winner
// ─────────────────────────────────────────────────────────────
export function AdminResults() {
  const { addToast } = useStore()
  const [rounds,     setRounds]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [publishing, setPublishing] = useState({})
  const [selected,   setSelected]   = useState({}) // { [roundId]: imageId }

  useEffect(() => {
    adminApi.rounds({ status: 'live' })
      .then(r => setRounds(r?.data?.rounds || []))
      .catch(() => addToast('Could not load live rounds', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handlePublish = async (round) => {
    const winnerImageId = selected[round.id]
    if (!winnerImageId) { addToast('Please select the winning image first', 'warning'); return }
    if (!window.confirm(`Publish result for ${round.round_code}? This will credit all winners and cannot be undone.`)) return

    setPublishing(p => ({ ...p, [round.id]: true }))
    try {
      const res = await adminApi.publishResult(round.id, winnerImageId)
      const d   = res?.data || {}
      addToast(
        `✅ Result published! ${d.winner_count || 0} winners get ${fmt(d.payout_per_winner || 0)} each`,
        'success'
      )
      // Remove round from list
      setRounds(p => p.filter(r => r.id !== round.id))
    } catch (err) { addToast(err.message || 'Publish failed', 'error') }
    finally { setPublishing(p => ({ ...p, [round.id]: false })) }
  }

  return (
    <AdminLayout title="Publish Results">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-72 rounded-xl" /></div>)}
        </div>
      ) : rounds.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-sm mb-3" style={{ color: 'var(--text3)' }}>No live rounds awaiting results</div>
          <Link to="/admin/create-round" className="btn-primary text-sm inline-flex"><Plus size={14} /> Create Round</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {rounds.map(round => (
            <div key={round.id} className="card">
              <div className="flex justify-between items-center mb-3">
                <span className="badge-green">🔴 Live</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text4)' }}>{round.round_code}</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>{round.theme}</h3>
              <div className="text-xs mb-4" style={{ color: 'var(--text3)' }}>
                {(round.total_voters || 0).toLocaleString()} voters · Prize: <span className="text-neon font-bold">{fmt(round.prize_pool)}</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text4)' }}>Click the winning image:</p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {(round.images || []).map(img => (
                  <div key={img.id}
                    onClick={() => setSelected(p => ({ ...p, [round.id]: img.id }))}
                    className="relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all"
                    style={{
                      background: img.bg_gradient || 'linear-gradient(135deg,#1a1a2e,#16213e)',
                      borderColor: selected[round.id] === img.id ? '#fbbf24' : 'var(--border)',
                      boxShadow: selected[round.id] === img.id ? '0 0 20px rgba(251,191,36,0.3)' : 'none',
                    }}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <span className="text-3xl">{img.emoji || '🖼️'}</span>
                      <span className="text-[10px] font-bold text-white text-center leading-tight">{img.label}</span>
                      <span className="text-[9px] text-white/50">{img.vote_count || 0} votes</span>
                    </div>
                    {selected[round.id] === img.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selected[round.id] && (
                <div className="text-xs text-center mb-3" style={{ color: 'var(--text3)' }}>
                  Selected: <strong className="text-yellow-400">
                    {round.images?.find(img => img.id === selected[round.id])?.label}
                  </strong>
                </div>
              )}

              <button
                disabled={publishing[round.id]}
                className="btn-danger w-full justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handlePublish(round)}>
                {publishing[round.id]
                  ? <><Loader2 size={14} className="animate-spin" /> Publishing...</>
                  : '🏆 Publish Result'}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN DEPOSITS
// ─────────────────────────────────────────────────────────────
export function AdminDeposits() {
  const { addToast } = useStore()
  const [deposits,  setDeposits]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [status,    setStatus]    = useState('')
  const [page,      setPage]      = useState(1)
  const [meta,      setMeta]      = useState(null)
  const [actioning, setActioning] = useState({})

  const fetchDeposits = useCallback((s = status, p = page) => {
    setLoading(true)
    adminApi.deposits(s ? { status: s, page: p } : { page: p })
      .then(r => { setDeposits(r?.data?.deposits || []); setMeta(r?.data?.meta || null) })
      .catch(() => addToast('Could not load deposits', 'error'))
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { fetchDeposits('', 1) }, [])

  const handleApprove = async (id) => {
    setActioning(p => ({ ...p, [id]: 'approving' }))
    try {
      await adminApi.approveDeposit(id)
      addToast('Deposit approved and balance credited ✅', 'success')
      fetchDeposits(status, page)
    } catch (err) { addToast(err.message || 'Approval failed', 'error') }
    finally { setActioning(p => ({ ...p, [id]: null })) }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):') ?? ''
    if (reason === null) return
    setActioning(p => ({ ...p, [id]: 'rejecting' }))
    try {
      await adminApi.rejectDeposit(id, reason)
      addToast('Deposit rejected', 'warning')
      fetchDeposits(status, page)
    } catch (err) { addToast(err.message || 'Rejection failed', 'error') }
    finally { setActioning(p => ({ ...p, [id]: null })) }
  }

  return (
    <AdminLayout title="Deposits">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
            All Deposits {meta ? `(${meta.total})` : ''}
          </div>
          <div className="flex gap-2">
            <select className="input text-sm py-2" style={{ width: 'auto' }}
              value={status} onChange={e => { setStatus(e.target.value); setPage(1); fetchDeposits(e.target.value, 1) }}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn-ghost text-xs" onClick={() => fetchDeposits(status, page)}><RefreshCw size={13} /></button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <TH cols={['User', 'Amount', 'Method', 'Status', 'Date', 'Action']} />
            <tbody>
              {loading
                ? <SkeletonRows n={5} cols={6} />
                : deposits.length === 0
                  ? <EmptyState icon="💰" message="No deposits found" />
                  : deposits.map(d => (
                    <tr key={d.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>@{d.username}</div>
                          <div className="text-[10px]" style={{ color: 'var(--text4)' }}>{d.email}</div>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-neon">{fmt(d.amount)}</td>
                      <td className="py-3 text-sm" style={{ color: 'var(--text3)' }}>{d.method || '—'}</td>
                      <td className="py-3">
                        <span className={d.status === 'completed' ? 'badge-green' : d.status === 'rejected' ? 'badge-red' : 'badge-yellow'}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(d.created_at)}</td>
                      <td className="py-3">
                        {d.status === 'pending' ? (
                          <div className="flex gap-1.5">
                            <button
                              disabled={!!actioning[d.id]}
                              className="btn-primary text-xs py-1 px-2.5 disabled:opacity-60"
                              onClick={() => handleApprove(d.id)}>
                              {actioning[d.id] === 'approving'
                                ? <Loader2 size={11} className="animate-spin" />
                                : <><CheckCircle size={11} /> Approve</>}
                            </button>
                            <button
                              disabled={!!actioning[d.id]}
                              className="btn-danger text-xs py-1 px-2.5 disabled:opacity-60"
                              onClick={() => handleReject(d.id)}>
                              {actioning[d.id] === 'rejecting'
                                ? <Loader2 size={11} className="animate-spin" />
                                : <XCircle size={11} />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text4)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => { setPage(p); fetchDeposits(status, p) }}
                className="min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors border"
                style={{ background: p === page ? 'var(--neon)' : 'transparent', color: p === page ? '#000' : 'var(--text4)', borderColor: p === page ? 'var(--neon)' : 'var(--border)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN WITHDRAWALS
// ─────────────────────────────────────────────────────────────
export function AdminWithdrawals() {
  const { addToast } = useStore()
  const [withdrawals, setWithdrawals] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [status,      setStatus]      = useState('')
  const [page,        setPage]        = useState(1)
  const [meta,        setMeta]        = useState(null)
  const [actioning,   setActioning]   = useState({})

  const fetchWithdrawals = useCallback((s = status, p = page) => {
    setLoading(true)
    adminApi.withdrawals(s ? { status: s, page: p } : { page: p })
      .then(r => { setWithdrawals(r?.data?.withdrawals || []); setMeta(r?.data?.meta || null) })
      .catch(() => addToast('Could not load withdrawals', 'error'))
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { fetchWithdrawals('', 1) }, [])

  const handleApprove = async (id) => {
    setActioning(p => ({ ...p, [id]: 'approving' }))
    try {
      await adminApi.approveWithdrawal(id)
      addToast('Withdrawal approved ✅', 'success')
      fetchWithdrawals(status, page)
    } catch (err) { addToast(err.message || 'Approval failed', 'error') }
    finally { setActioning(p => ({ ...p, [id]: null })) }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (balance will be refunded):') ?? ''
    if (reason === null) return
    setActioning(p => ({ ...p, [id]: 'rejecting' }))
    try {
      await adminApi.rejectWithdrawal(id, reason)
      addToast('Withdrawal rejected, balance refunded', 'warning')
      fetchWithdrawals(status, page)
    } catch (err) { addToast(err.message || 'Rejection failed', 'error') }
    finally { setActioning(p => ({ ...p, [id]: null })) }
  }

  return (
    <AdminLayout title="Withdrawals">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
            Withdrawal Requests {meta ? `(${meta.total})` : ''}
          </div>
          <div className="flex gap-2">
            <select className="input text-sm py-2" style={{ width: 'auto' }}
              value={status} onChange={e => { setStatus(e.target.value); setPage(1); fetchWithdrawals(e.target.value, 1) }}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn-ghost text-xs" onClick={() => fetchWithdrawals(status, page)}><RefreshCw size={13} /></button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <TH cols={['User', 'Amount', 'Account', 'Status', 'Date', 'Action']} />
            <tbody>
              {loading
                ? <SkeletonRows n={5} cols={6} />
                : withdrawals.length === 0
                  ? <EmptyState icon="💸" message="No withdrawals found" />
                  : withdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3">
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>@{w.username}</div>
                          <div className="text-[10px]" style={{ color: 'var(--text4)' }}>{w.full_name}</div>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-red-400">-{fmt(w.amount)}</td>
                      <td className="py-3 text-sm" style={{ color: 'var(--text3)' }}>{w.method || '—'}</td>
                      <td className="py-3">
                        <span className={w.status === 'completed' ? 'badge-green' : w.status === 'rejected' ? 'badge-red' : 'badge-yellow'}>
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(w.created_at)}</td>
                      <td className="py-3">
                        {w.status === 'pending' ? (
                          <div className="flex gap-1.5">
                            <button
                              disabled={!!actioning[w.id]}
                              className="btn-primary text-xs py-1 px-2.5 disabled:opacity-60"
                              onClick={() => handleApprove(w.id)}>
                              {actioning[w.id] === 'approving'
                                ? <Loader2 size={11} className="animate-spin" />
                                : <><CheckCircle size={11} /> Approve</>}
                            </button>
                            <button
                              disabled={!!actioning[w.id]}
                              className="btn-danger text-xs py-1 px-2.5 disabled:opacity-60"
                              onClick={() => handleReject(w.id)}>
                              {actioning[w.id] === 'rejecting'
                                ? <Loader2 size={11} className="animate-spin" />
                                : <XCircle size={11} />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text4)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => { setPage(p); fetchWithdrawals(status, p) }}
                className="min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors border"
                style={{ background: p === page ? 'var(--neon)' : 'transparent', color: p === page ? '#000' : 'var(--text4)', borderColor: p === page ? 'var(--neon)' : 'var(--border)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN SETTINGS
// ─────────────────────────────────────────────────────────────
export function AdminSettings() {
  const { addToast } = useStore()
  const [settings, setSettings] = useState({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState({})

  useEffect(() => {
    adminApi.getSettings()
      .then(r => setSettings(r?.data?.settings || {}))
      .catch(() => addToast('Could not load settings', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (group, fields) => {
    setSaving(p => ({ ...p, [group]: true }))
    try {
      const payload = {}
      fields.forEach(({ key }) => { if (settings[group]?.[key] !== undefined) payload[key] = settings[group][key] })
      await adminApi.saveSettings(payload)
      addToast(`${group.replace('_', ' ')} settings saved!`, 'success')
    } catch (err) { addToast(err.message || 'Save failed', 'error') }
    finally { setSaving(p => ({ ...p, [group]: false })) }
  }

  const setVal = (group, key, val) => setSettings(p => ({
    ...p, [group]: { ...(p[group] || {}), [key]: val }
  }))

  const sections = [
    {
      group: 'general',
      title: 'Site Settings',
      fields: [
        { key: 'site_name',    label: 'Site Name' },
        { key: 'site_url',     label: 'Site URL' },
        { key: 'support_email',label: 'Support Email' },
        { key: 'tagline',      label: 'Platform Tagline' },
      ]
    },
    {
      group: 'game',
      title: 'Game Settings',
      fields: [
        { key: 'max_prize_pool',    label: 'Max Prize Pool ($)' },
        { key: 'platform_fee_pct',  label: 'Platform Fee (%)' },
        { key: 'referral_pct',      label: 'Referral Commission (%)' },
      ]
    },
    {
      group: 'payment',
      title: 'Payment Settings',
      fields: [
        { key: 'min_deposit',         label: 'Min Deposit ($)' },
        { key: 'min_withdrawal',      label: 'Min Withdrawal ($)' },
        { key: 'usdt_trc20_wallet',   label: 'USDT Wallet (TRC20)' },
        { key: 'btc_wallet',          label: 'BTC Wallet' },
        { key: 'eth_wallet',          label: 'ETH Wallet' },
        { key: 'bank_name',           label: 'Bank Name' },
        { key: 'bank_account_number', label: 'Bank Account Number' },
        { key: 'bank_account_name',   label: 'Bank Account Name' },
        { key: 'bank_routing',        label: 'Bank Routing Number' },
      ]
    },
  ]

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-xl space-y-5">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-48 rounded-xl" /></div>)
        ) : (
          sections.map(section => (
            <div key={section.group} className="card">
              <h3 className="font-display font-bold text-base mb-5" style={{ color: 'var(--text)' }}>{section.title}</h3>
              <div className="space-y-4">
                {section.fields.map(f => (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    <input className="input"
                      value={settings[section.group]?.[f.key] ?? ''}
                      onChange={e => setVal(section.group, f.key, e.target.value)} />
                  </div>
                ))}
              </div>
              <button
                disabled={!!saving[section.group]}
                className="btn-primary text-sm mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleSave(section.group, section.fields)}>
                {saving[section.group]
                  ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  : 'Save Changes'}
              </button>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
