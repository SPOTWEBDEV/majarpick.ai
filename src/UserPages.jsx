import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import {
  MOCK_TRANSACTIONS, MOCK_REFERRALS, MOCK_ROUNDS, MOCK_USER,
  fmt, fmtDate, initials
} from '../data/mockData'
import DashboardLayout from '../layouts/DashboardLayout'
import VoteImageCard from '../components/VoteImageCard'
import Countdown from '../components/Countdown'
import Avatar from '../components/Avatar'
import { Copy, Check, Plus, ArrowUpCircle, Upload, Trash2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// WITHDRAWAL
// ─────────────────────────────────────────────────────────────
export function Withdrawal() {
  const { addToast } = useStore()
  const [method, setMethod] = useState('bank')
  const withdrawals = MOCK_TRANSACTIONS.filter(t => t.type === 'withdrawal')

  return (
    <DashboardLayout title="Withdraw Funds">
      <div className="card border-white/12 mb-5 bg-gradient-to-r from-dark-3 to-card-2">
        <div className="text-xs text-white/40 mb-1">Available Balance</div>
        <div className="font-display font-black text-3xl text-neon">{fmt(MOCK_USER.balance)}</div>
        <div className="text-xs text-white/30 mt-1">Min withdrawal: $20</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card border-white/12">
          <h3 className="font-display font-bold text-base mb-4">Withdrawal Details</h3>
          <div className="tabs mb-5">
            <div className={`tab ${method === 'bank' ? 'active' : ''}`} onClick={() => setMethod('bank')}>🏦 Bank</div>
            <div className={`tab ${method === 'crypto' ? 'active' : ''}`} onClick={() => setMethod('crypto')}>₿ Crypto</div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Withdrawal Account</label>
              {method === 'bank' ? (
                <div className="bg-dark-3 border border-white/12 rounded-lg p-3">
                  <div className="font-semibold text-sm">Chase Bank — Acc ending 8901</div>
                  <div className="text-xs text-white/40">Alex Johnson</div>
                </div>
              ) : (
                <div className="bg-dark-3 border border-white/12 rounded-lg p-3">
                  <div className="font-semibold text-sm">USDT (TRC20)</div>
                  <div className="text-xs font-mono text-white/40">TXmJ2...4Kp8</div>
                </div>
              )}
              <Link to="/add-account" className="inline-flex items-center gap-1 text-xs text-neon mt-2 hover:underline">
                <Plus size={12} /> Change Account
              </Link>
            </div>
            <div>
              <label className="label">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">$</span>
                <input className="input pl-7" type="number" placeholder="Enter amount" min="20" />
              </div>
            </div>
            <div className="bg-dark-3 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between text-white/50"><span>Processing Fee</span><span className="text-neon">0%</span></div>
              <div className="flex justify-between text-white/50">
                <span>Est. Arrival</span>
                <span>{method === 'bank' ? '1-3 business days' : '< 1 hour'}</span>
              </div>
            </div>
            <button className="btn-primary w-full justify-center py-3" onClick={() => addToast('Withdrawal request submitted!', 'success')}>
              <ArrowUpCircle size={16} /> Withdraw Funds
            </button>
          </div>
        </div>

        <div className="card border-white/12">
          <h3 className="font-display font-bold text-sm mb-4">Important Notes</h3>
          <div className="space-y-3">
            {[
              { icon: '⚡', title: 'Crypto Withdrawals', desc: 'Processed within 1 hour, 24/7' },
              { icon: '🏦', title: 'Bank Transfers', desc: '1-3 business days, Mon-Fri' },
              { icon: '✅', title: 'Minimum Amount', desc: 'At least $20 per withdrawal' },
              { icon: '📞', title: 'Support', desc: 'Issues? Contact support within 24hrs' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{n.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-white/40">{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-white/12">
        <h3 className="font-display font-bold text-sm sm:text-base mb-4">Withdrawal History</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-white/8">
                {['ID', 'Amount', 'Account', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 font-mono text-xs text-white/30">{t.id}</td>
                  <td className="py-3 font-bold text-red-400">-{fmt(t.amount)}</td>
                  <td className="py-3 text-white/40">{t.method}</td>
                  <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                  <td className="py-3 text-white/30 text-xs">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// REFERRAL
// ─────────────────────────────────────────────────────────────
export function Referral() {
  const { addToast } = useStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    addToast('Referral link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout title="Referral Program">
      <div className="card border-neon/20 bg-gradient-to-br from-neon/8 to-transparent mb-5 p-5 sm:p-6 text-center">
        <div className="text-4xl mb-3">🎁</div>
        <h2 className="font-display font-black text-xl sm:text-2xl mb-2">Earn 5% Forever</h2>
        <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
          Share your link. Earn 5% commission on every deposit your referrals make — for life.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input readOnly value="https://voteai.io/ref/ALEX2024" className="input text-xs flex-1 text-center" />
          <button className="btn-primary px-4 flex-shrink-0" onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Referrals', val: '12', color: '#60a5fa' },
          { label: 'Active', val: '9', color: '#00ff9d' },
          { label: 'Total Earned', val: '$360', color: '#fbbf24' },
          { label: 'This Month', val: '$120', color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="card border-white/12 text-center py-4">
            <div className="font-display font-black text-2xl sm:text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card border-white/12">
          <h3 className="font-display font-bold text-sm mb-4">Your Referrals</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[340px]">
              <thead>
                <tr className="border-b border-white/8">
                  {['User', 'Joined', 'Status', 'Earned'].map(h => (
                    <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_REFERRALS.map((r, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar text={initials(r.name)} size="xs" />
                        <div>
                          <div className="text-sm font-semibold">{r.name}</div>
                          <div className="text-[10px] text-white/30">@{r.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-white/40">{fmtDate(r.date)}</td>
                    <td className="py-3"><span className={r.status === 'active' ? 'badge-green' : 'badge-blue'}>{r.status}</span></td>
                    <td className="py-3 font-bold text-neon">{fmt(r.earned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border-white/12">
          <h3 className="font-display font-bold text-sm mb-4">How Referrals Work</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Share your unique referral link with friends' },
              { step: '2', text: 'Friend clicks your link and registers on VoteAI' },
              { step: '3', text: 'They make their first deposit (any amount)' },
              { step: '4', text: 'You earn 5% commission — instantly credited' },
              { step: '5', text: 'Earn 5% on ALL their future deposits forever!' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-neon/15 border border-neon/25 rounded-full flex items-center justify-center text-sm font-black text-neon flex-shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div className="text-sm text-white/60 pt-1">{s.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-neon/8 border border-neon/20 rounded-xl p-3 text-xs text-neon/80">
            💡 No cap on earnings! 12 active referrals currently earning you passive income.
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────
export function Settings() {
  const { darkMode, toggleTheme, addToast } = useStore()
  const [toggles, setToggles] = useState({ results: true, deposits: true, withdrawals: true, referrals: false, promos: false })

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-5">
        <div className="card border-white/12">
          <h3 className="font-display font-bold text-base mb-5">Profile Settings</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#00ff9d,#1e90ff)' }}>AJ</div>
            <div>
              <button className="btn-ghost text-xs"><Upload size={13} /> Change Photo</button>
              <div className="text-xs text-white/25 mt-1">Max 2MB · JPG, PNG</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div><label className="label">Full Name</label><input className="input" defaultValue={MOCK_USER.name} /></div>
            <div><label className="label">Username</label><input className="input" defaultValue={MOCK_USER.username} /></div>
            <div><label className="label">Email</label><input className="input" type="email" defaultValue={MOCK_USER.email} /></div>
            <div><label className="label">Phone</label><input className="input" defaultValue={MOCK_USER.phone} /></div>
          </div>
          <button className="btn-primary text-sm" onClick={() => addToast('Profile updated!', 'success')}>Save Changes</button>
        </div>

        <div className="card border-white/12">
          <h3 className="font-display font-bold text-base mb-5">Change Password</h3>
          <div className="space-y-4 mb-5">
            <div><label className="label">Current Password</label><input className="input" type="password" placeholder="••••••••" /></div>
            <div><label className="label">New Password</label><input className="input" type="password" placeholder="Min 8 characters" /></div>
            <div><label className="label">Confirm New Password</label><input className="input" type="password" placeholder="Repeat new password" /></div>
          </div>
          <button className="btn-primary text-sm" onClick={() => addToast('Password updated!', 'success')}>Update Password</button>
        </div>

        <div className="card border-white/12">
          <h3 className="font-display font-bold text-base mb-5">Notifications</h3>
          {[
            { key: 'results', label: 'Round Results', desc: 'When your voting round result is ready' },
            { key: 'deposits', label: 'Deposits', desc: 'When deposit is confirmed' },
            { key: 'withdrawals', label: 'Withdrawals', desc: 'When withdrawal is processed' },
            { key: 'referrals', label: 'New Referrals', desc: 'When someone uses your referral code' },
            { key: 'promos', label: 'Promotions', desc: 'News, offers and updates' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm font-semibold">{n.label}</div>
                <div className="text-xs text-white/30">{n.desc}</div>
              </div>
              <div className={`toggle ${toggles[n.key] ? 'on' : ''}`}
                onClick={() => setToggles(p => ({ ...p, [n.key]: !p[n.key] }))}>
                <div className="toggle-thumb" />
              </div>
            </div>
          ))}
        </div>

        <div className="card border-white/12">
          <h3 className="font-display font-bold text-base mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Dark Mode</div>
              <div className="text-xs text-white/30">Currently: {darkMode ? 'Dark' : 'Light'} theme</div>
            </div>
            <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={toggleTheme}>
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>

        <div className="card border-white/12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base">Withdrawal Accounts</h3>
            <Link to="/add-account" className="btn-primary text-xs px-3 py-1.5"><Plus size={13} /> Add</Link>
          </div>
          {[
            { icon: '🏦', name: 'Chase Bank', detail: 'Acc ending 8901' },
            { icon: '₿', name: 'USDT TRC20', detail: 'TXmJ2...4Kp8' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-dark-3 rounded-xl mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{a.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-xs text-white/40 font-mono">{a.detail}</div>
                </div>
              </div>
              <button className="btn-icon w-7 h-7 text-red-400 hover:bg-red-500/10"
                onClick={() => addToast('Account removed', 'error')}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// ROUNDS
// ─────────────────────────────────────────────────────────────
export function Rounds() {
  const { addToast } = useStore()

  return (
    <DashboardLayout title="Vote Rounds">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_ROUNDS.map((round, ri) => (
          <div key={ri} className="card card-hover card-glow border-white/12">
            <div className="flex justify-between items-start mb-3">
              <span className={round.status === 'live' ? 'badge-green' : round.status === 'upcoming' ? 'badge-yellow' : 'badge-blue'}>
                {round.status === 'live' ? '🔴' : round.status === 'upcoming' ? '🟡' : '✅'} {round.status}
              </span>
              <span className="text-[10px] font-mono text-white/25">{round.id}</span>
            </div>
            <h3 className="font-display font-bold text-sm mb-3">{round.theme}</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-dark-3 rounded-lg p-2.5 text-center">
                <div className="text-xs text-white/30 mb-0.5">Prize</div>
                <div className="font-display font-black text-base text-neon">{fmt(round.prize)}</div>
              </div>
              <div className="bg-dark-3 rounded-lg p-2.5 text-center">
                <div className="text-xs text-white/30 mb-0.5">Voters</div>
                <div className="font-display font-black text-base">{round.participants.toLocaleString()}</div>
              </div>
            </div>
            {round.status !== 'ended' && (
              <div className="mb-3 flex justify-center"><Countdown seconds={round.countdown} size="sm" /></div>
            )}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {round.set.images.map((img, i) => (
                <VoteImageCard key={i} image={img} index={i} locked
                  isWinner={round.status === 'ended' && round.winner === i}
                  selected={round.myVote === i}
                  showVotes={round.status === 'ended'} />
              ))}
            </div>
            {round.status === 'ended' && round.myVote !== null && (
              <div className={`text-center text-xs font-bold py-1.5 rounded-lg mb-2 ${round.myVote === round.winner ? 'bg-neon/15 text-neon' : 'bg-red-500/15 text-red-400'}`}>
                {round.myVote === round.winner ? '✅ You Won!' : '❌ You Lost'}
              </div>
            )}
            {round.status === 'live' && (
              <Link to="/dashboard" className="btn-primary w-full justify-center text-sm">Vote Now →</Link>
            )}
            {round.status === 'upcoming' && (
              <button className="btn-ghost w-full justify-center text-sm" onClick={() => addToast('Reminder set!', 'success')}>
                Set Reminder 🔔
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// HISTORY
// ─────────────────────────────────────────────────────────────
export function History() {
  return (
    <DashboardLayout title="Transaction History">
      <div className="card border-white/12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h3 className="font-display font-bold text-base">All Transactions</h3>
          <select className="input text-sm py-1.5" style={{ width: 'auto' }}>
            <option>All Types</option>
            <option>Deposits</option>
            <option>Withdrawals</option>
            <option>Winnings</option>
          </select>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[460px]">
            <thead>
              <tr className="border-b border-white/8">
                {['ID', 'Type', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 font-mono text-[10px] text-white/25">{t.id}</td>
                  <td className="py-3"><span className={t.type === 'deposit' ? 'badge-blue' : t.type === 'win' ? 'badge-gold' : 'badge-purple'}>{t.type}</span></td>
                  <td className={`py-3 font-bold ${t.type === 'withdrawal' ? 'text-red-400' : 'text-neon'}`}>
                    {t.type === 'withdrawal' ? '-' : '+'}{fmt(t.amount)}
                  </td>
                  <td className="py-3 text-white/40">{t.method}</td>
                  <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                  <td className="py-3 text-xs text-white/30">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export function Notifications() {
  const notifs = [
    { icon: '🏆', title: 'You won $87.50!', desc: 'Round R045 — Nightmare Faces ended. Your vote won!', time: '2m ago', read: false },
    { icon: '💰', title: 'Deposit confirmed', desc: '$500 via Bank Transfer credited to your account.', time: '1h ago', read: false },
    { icon: '👥', title: 'New referral!', desc: '@jakeT registered using your referral code. +$5 earned.', time: '3h ago', read: false },
    { icon: '🎮', title: 'New round starting', desc: 'Scary Creatures #48 starts in 10 mins. Prize: $750!', time: '1d ago', read: true },
    { icon: '🚀', title: 'Level Up!', desc: "You've reached Gold voter level. +10% prize multiplier!", time: '2d ago', read: true },
  ]
  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className={`card border-white/12 flex items-start gap-4 ${!n.read ? 'border-neon/20 bg-neon/5' : ''}`}>
            <span className="text-2xl mt-0.5 flex-shrink-0">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-sm">{n.title}</div>
                <span className="text-xs text-white/25 flex-shrink-0">{n.time}</span>
              </div>
              <div className="text-xs text-white/50 mt-0.5">{n.desc}</div>
            </div>
            {!n.read && <div className="w-2 h-2 bg-neon rounded-full flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
