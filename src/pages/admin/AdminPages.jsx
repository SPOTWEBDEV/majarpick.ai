import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'
import {
  ADMIN_USERS, MOCK_TRANSACTIONS, MOCK_ROUNDS, AI_IMAGE_SETS,
  fmt, fmtDate, initials
} from '../../data/mockData'
import AdminLayout from '../../layouts/AdminLayout'
import Avatar from '../../components/Avatar'
import VoteImageCard from '../../components/VoteImageCard'
import {
  Users, Gamepad2, ArrowDownCircle, ArrowUpCircle,
  DollarSign, TrendingUp, ShieldCheck, Cpu,
  Eye, Ban, CheckCircle, XCircle, Plus, Upload
} from 'lucide-react'
import { authApi } from '../../services/api'

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────
export function AdminLogin() {
  const navigate = useNavigate()
  const { adminLoginSuccess, addToast } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.adminLogin({
        email,
        password
      })
      console.log('Admin login response:', res)
      adminLoginSuccess(res.data.admin, res.data.token)
      addToast('Admin access granted', 'success')
      navigate('/admin/dashboard')
      
    } catch (err) {
      addToast(err.message || 'Login failed' , 'error')
      console.error('Admin login error:', err)
    } finally {
      setLoading(false)
    }


  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(239,68,68,0.08)_0%,transparent_60%)] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="font-display font-black text-2xl">Vote<span className="text-neon">AI</span></span>
          </Link>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-red-500/15 border border-red-500/25 rounded-full text-xs font-bold text-red-400 uppercase tracking-wider">
            <ShieldCheck size={11} /> Admin Panel
          </div>
        </div>
        <div className="card border-white/12 p-7">
          <h2 className="font-display font-black text-xl mb-1">Admin Login</h2>
          <p className="text-white/40 text-sm mb-6">Restricted access — authorized personnel only</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <input className="input" onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" onChange={(e) => setPassword(e.target.value)} type="password" />
            </div>
            <button type="submit" className="btn-danger w-full justify-center py-3 text-base">
              <ShieldCheck size={16} /> Access Admin Panel
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-white/30 hover:text-white">← Back to site</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD HOME
// ─────────────────────────────────────────────────────────────
const barData = [45, 62, 38, 80, 55, 90, 72]
const barLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const maxBar = Math.max(...barData)

export function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard Overview">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        {[
          { label: 'Total Users', val: '8,423', icon: Users, color: '#60a5fa', change: '+124 this week' },
          { label: 'Active Rounds', val: '12', icon: Gamepad2, color: '#00ff9d', change: '2 ending soon' },
          { label: 'Total Deposits', val: '$284K', icon: ArrowDownCircle, color: '#fbbf24', change: '+$12K this week' },
          { label: 'Revenue', val: '$86K', icon: DollarSign, color: '#a78bfa', change: '+8.2% vs last week' },
        ].map(s => (
          <div key={s.label} className="card border-white/12">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-bold text-white/30 uppercase tracking-wider">{s.label}</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs text-white/30">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="card border-white/12">
          <h3 className="font-display font-bold text-sm mb-5">Revenue This Week</h3>
          <div className="flex items-end gap-2 h-28">
            {barData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[9px] text-white/30 font-bold">${v}k</div>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${Math.round((v / maxBar) * 80)}px`,
                    background: 'linear-gradient(180deg,#00ff9d,#1e90ff)',
                  }}
                />
                <div className="text-[9px] text-white/30">{barLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card border-white/12">
          <h3 className="font-display font-bold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-0">
            {[
              { icon: '👤', text: 'New user registered: @sarahm', time: '2m ago' },
              { icon: '💰', text: 'Deposit: $500 from @alexj', time: '8m ago' },
              { icon: '🏆', text: 'Round R047 completed — 2,341 voters', time: '15m ago' },
              { icon: '💸', text: 'Withdrawal: $200 for @priyak', time: '1h ago' },
              { icon: '🎮', text: 'New round R048 created', time: '2h ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5">
                <span className="text-base">{a.icon}</span>
                <span className="flex-1 text-sm text-white/60">{a.text}</span>
                <span className="text-[10px] text-white/25 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Withdrawals', val: '$198K', color: '#f87171' },
          { label: 'Pending Deposits', val: '4', color: '#fbbf24' },
          { label: 'Pending Withdrawals', val: '7', color: '#fb923c' },
          { label: 'Round Win Rate', val: '62%', color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="card border-white/12 text-center py-3">
            <div className="font-display font-black text-xl sm:text-2xl" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────────────────────
export function AdminUsers() {
  const { addToast } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = ADMIN_USERS.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout title="All Users">
      <div className="card border-white/12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="font-display font-bold text-sm">Users ({filtered.length})</div>
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                className="input text-sm py-2 pl-8 w-full sm:w-48"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <select className="input text-sm py-2" style={{ width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[580px]">
            <thead>
              <tr className="border-b border-white/8">
                {['User', 'Email', 'Balance', 'Votes', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar text={initials(u.username)} size="xs" />
                      <span className="font-semibold">@{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3 text-white/40 text-xs">{u.email}</td>
                  <td className="py-3 font-bold text-neon">{fmt(u.balance)}</td>
                  <td className="py-3 text-white/60">{u.votes}</td>
                  <td className="py-3">
                    <span className={u.status === 'active' ? 'badge-green' : u.status === 'suspended' ? 'badge-red' : 'badge-blue'}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-white/30">{fmtDate(u.date)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="btn-icon w-7 h-7" onClick={() => addToast(`Viewing @${u.username}`, 'info')} title="View">
                        <Eye size={12} />
                      </button>
                      <button
                        className={`btn-icon w-7 h-7 ${u.status === 'active' ? 'text-red-400 hover:bg-red-500/10' : 'text-neon hover:bg-neon/10'}`}
                        onClick={() => addToast(`${u.status === 'active' ? 'Suspended' : 'Activated'} @${u.username}`, u.status === 'active' ? 'error' : 'success')}
                        title={u.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {u.status === 'active' ? <Ban size={12} /> : <CheckCircle size={12} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {[1, 2, 3, '...', 12].map((p, i) => (
            <button key={i} className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors border ${p === 1 ? 'bg-neon text-black border-neon' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN ROUNDS
// ─────────────────────────────────────────────────────────────
export function AdminRounds() {
  const { addToast } = useStore()
  return (
    <AdminLayout title="All Rounds">
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-white/40">{MOCK_ROUNDS.length} total rounds</div>
        <Link to="/admin/create-round" className="btn-primary text-sm"><Plus size={14} /> New Round</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_ROUNDS.map((round, i) => (
          <div key={i} className="card border-white/12">
            <div className="flex justify-between items-center mb-3">
              <span className={round.status === 'live' ? 'badge-green' : round.status === 'upcoming' ? 'badge-yellow' : 'badge-blue'}>
                {round.status === 'live' ? '🔴' : round.status === 'upcoming' ? '🟡' : '✅'} {round.status}
              </span>
              <span className="text-[10px] font-mono text-white/25">{round.id}</span>
            </div>
            <h3 className="font-display font-bold text-sm mb-2">{round.theme}</h3>
            <div className="flex justify-between text-xs text-white/40 mb-3">
              <span>Prize: <strong className="text-neon">{fmt(round.prize)}</strong></span>
              <span>{round.participants.toLocaleString()} voters</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {round.set.images.map((img, j) => (
                <VoteImageCard key={j} image={img} index={j} locked isWinner={round.status === 'ended' && round.winner === j} />
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 text-xs py-1.5" onClick={() => addToast('Round details', 'info')}>Details</button>
              {round.status !== 'ended' && (
                <button className="btn-danger text-xs py-1.5 px-3" onClick={() => addToast('Round cancelled', 'error')}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN CREATE ROUND
// ─────────────────────────────────────────────────────────────
export function AdminCreateRound() {
  const { addToast } = useStore()
  const navigate = useNavigate()

  const handleCreate = (e) => {
    e.preventDefault()
    addToast('Round created successfully! 🎮', 'success')
    navigate('/admin/rounds')
  }

  return (
    <AdminLayout title="Create New Round">
      <div className="max-w-xl">
        <div className="card border-white/12 p-6 sm:p-8">
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="label">Round Title / Theme</label>
              <input className="input" placeholder="e.g. Scary Creatures #48" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prize Amount ($)</label>
                <input className="input" type="number" placeholder="500" min="10" />
              </div>
              <div>
                <label className="label">Duration (minutes)</label>
                <input className="input" type="number" placeholder="10" min="1" />
              </div>
            </div>
            <div>
              <label className="label">Start Date & Time</label>
              <input className="input" type="datetime-local" />
            </div>

            {/* Image upload */}
            <div>
              <label className="label">Upload 3 AI Images</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    onClick={() => addToast('File dialog opened', 'info')}
                    className="border-2 border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-neon/40 hover:bg-neon/5 transition-all aspect-square"
                  >
                    <Upload size={20} className="text-white/30" />
                    <span className="text-xs text-white/30">Image {n}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Image Labels (comma-separated)</label>
              <input className="input" placeholder="Shadow Beast, Void Watcher, Bone Crawler" />
            </div>

            <div>
              <label className="label">Image Descriptions (comma-separated)</label>
              <input className="input" placeholder="Deep shadow entity, Ancient eye of void, Skeleton horror" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1 justify-center py-3">
                <Gamepad2 size={15} /> Create Round
              </button>
              <button type="button" className="btn-ghost px-4" onClick={() => navigate('/admin/rounds')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN RESULTS (Choose winner)
// ─────────────────────────────────────────────────────────────
export function AdminResults() {
  const { addToast } = useStore()
  const [selected, setSelected] = useState({})

  const liveRounds = MOCK_ROUNDS.filter(r => r.status === 'live')

  const handlePublish = (roundId) => {
    if (selected[roundId] === undefined) {
      addToast('Please select a winning image first', 'warning')
      return
    }
    addToast(`✅ Result published for ${roundId}! ${MOCK_ROUNDS.find(r => r.id === roundId)?.participants.toLocaleString()} voters notified.`, 'success')
  }

  return (
    <AdminLayout title="Publish Results">
      {liveRounds.length === 0 ? (
        <div className="card border-white/12 text-center py-14">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-white/40 text-sm">No live rounds to publish results for</div>
          <Link to="/admin/create-round" className="btn-primary text-sm mt-4 inline-flex"><Plus size={14} /> Create Round</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {liveRounds.map((round, ri) => (
            <div key={ri} className="card border-white/12">
              <div className="flex justify-between items-center mb-3">
                <span className="badge-green">🔴 Live</span>
                <span className="text-[10px] font-mono text-white/25">{round.id}</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-1">{round.theme}</h3>
              <div className="text-xs text-white/40 mb-4">
                {round.participants.toLocaleString()} voters · Prize: <span className="text-neon font-bold">{fmt(round.prize)}</span>
              </div>
              <p className="text-xs text-white/40 mb-3">Click the winning image:</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {round.set.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelected(p => ({ ...p, [round.id]: i }))}
                    className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${selected[round.id] === i ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'border-white/10 hover:border-white/25'}`}
                    style={{ background: img.bg }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                      <span className="text-3xl">{img.emoji}</span>
                      <span className="text-[10px] font-bold text-white">{img.label}</span>
                    </div>
                    {selected[round.id] === i && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selected[round.id] !== undefined && (
                <div className="text-xs text-center text-white/50 mb-3">
                  Selected: <strong className="text-yellow-400">{round.set.images[selected[round.id]].label}</strong>
                </div>
              )}
              <button className="btn-danger w-full justify-center text-sm" onClick={() => handlePublish(round.id)}>
                🏆 Publish Result
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
  const deposits = [...MOCK_TRANSACTIONS.filter(t => t.type === 'deposit'), ...MOCK_TRANSACTIONS.filter(t => t.type === 'deposit')]
    .map((t, i) => ({ ...t, id: `T00${i + 1}`, user: `user${i + 1}` }))

  return (
    <AdminLayout title="Deposits">
      <div className="card border-white/12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="font-display font-bold text-sm">All Deposits</div>
          <div className="flex gap-2">
            <select className="input text-sm py-2" style={{ width: 'auto' }}>
              <option>All Status</option><option>Completed</option><option>Pending</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-white/8">
                {['User', 'Amount', 'Method', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deposits.map((t, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 font-semibold">@{t.user}</td>
                  <td className="py-3 font-bold text-neon">{fmt(t.amount)}</td>
                  <td className="py-3 text-white/40">{t.method}</td>
                  <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                  <td className="py-3 text-xs text-white/30">{fmtDate(t.date)}</td>
                  <td className="py-3">
                    {t.status === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button className="btn-primary text-xs py-1 px-2.5" onClick={() => addToast('Deposit approved!', 'success')}>
                          <CheckCircle size={11} /> Approve
                        </button>
                        <button className="btn-danger text-xs py-1 px-2.5" onClick={() => addToast('Deposit rejected', 'error')}>
                          <XCircle size={11} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-neon">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN WITHDRAWALS
// ─────────────────────────────────────────────────────────────
export function AdminWithdrawals() {
  const { addToast } = useStore()
  const withdrawals = [...MOCK_TRANSACTIONS.filter(t => t.type === 'withdrawal'), ...MOCK_TRANSACTIONS.filter(t => t.type === 'withdrawal')]
    .map((t, i) => ({ ...t, id: `W00${i + 1}`, user: `user${i + 1}` }))

  return (
    <AdminLayout title="Withdrawals">
      <div className="card border-white/12">
        <div className="font-display font-bold text-sm mb-5">Withdrawal Requests</div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[580px]">
            <thead>
              <tr className="border-b border-white/8">
                {['User', 'Amount', 'Account', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((t, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 font-semibold">@{t.user}</td>
                  <td className="py-3 font-bold text-red-400">-{fmt(t.amount)}</td>
                  <td className="py-3 text-white/40">{t.method}</td>
                  <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                  <td className="py-3 text-xs text-white/30">{fmtDate(t.date)}</td>
                  <td className="py-3">
                    {t.status === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button className="btn-primary text-xs py-1 px-2.5" onClick={() => addToast('Withdrawal approved!', 'success')}>
                          <CheckCircle size={11} /> Approve
                        </button>
                        <button className="btn-danger text-xs py-1 px-2.5" onClick={() => addToast('Withdrawal rejected', 'error')}>
                          <XCircle size={11} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-neon">✓ Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ADMIN SETTINGS
// ─────────────────────────────────────────────────────────────
export function AdminSettings() {
  const { addToast } = useStore()
  const sections = [
    {
      title: 'Site Settings',
      fields: [
        { label: 'Site Name', val: 'VoteAI' },
        { label: 'Site URL', val: 'https://voteai.io' },
        { label: 'Support Email', val: 'support@voteai.io' },
        { label: 'Platform Tagline', val: 'Train AI & Earn Real Money' },
      ]
    },
    {
      title: 'Game Settings',
      fields: [
        { label: 'Max Prize Pool ($)', val: '10000' },
        { label: 'Min Deposit ($)', val: '10' },
        { label: 'Min Withdrawal ($)', val: '20' },
        { label: 'Platform Fee (%)', val: '5' },
        { label: 'Referral Commission (%)', val: '5' },
      ]
    },
    {
      title: 'Payment Settings',
      fields: [
        { label: 'USDT Wallet (TRC20)', val: 'TXmJ2...4Kp8' },
        { label: 'BTC Wallet', val: '1BvBM...4RqY' },
        { label: 'ETH Wallet', val: '0x742d...e4a3' },
        { label: 'Bank Name', val: 'First National Bank' },
        { label: 'Bank Account Number', val: '0123 4567 8901' },
      ]
    },
  ]

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-xl space-y-5">
        {sections.map(section => (
          <div key={section.title} className="card border-white/12">
            <h3 className="font-display font-bold text-base mb-5">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map(f => (
                <div key={f.label}>
                  <label className="label">{f.label}</label>
                  <input className="input" defaultValue={f.val} />
                </div>
              ))}
            </div>
            <button className="btn-primary text-sm mt-5" onClick={() => addToast(`${section.title} saved!`, 'success')}>
              Save Changes
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
