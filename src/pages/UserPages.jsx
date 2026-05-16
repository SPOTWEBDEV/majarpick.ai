import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  transactionsApi, accountsApi, referralsApi,
  roundsApi, notificationsApi, authApi
} from '../services/api'
import { fmt, fmtDate } from '../data/mockData'
import DashboardLayout from '../layouts/DashboardLayout'
import VoteImageCard from '../components/VoteImageCard'
import Countdown from '../components/Countdown'
import Avatar from '../components/Avatar'
import { Copy, Check, Plus, ArrowUpCircle, Upload, Trash2, Loader2, RefreshCw } from 'lucide-react'

// ─── Skeleton rows helper ──────────────────────────────────────
const SkeletonRows = ({ n = 3, cols = 5 }) => Array(n).fill(0).map((_, i) => (
  <tr key={i}>
    {Array(cols).fill(0).map((_, j) => (
      <td key={j} className="py-3 pr-4"><div className="skeleton h-5 rounded" style={{ width: `${60 + Math.random() * 40}%` }} /></td>
    ))}
  </tr>
))

const TableHead = ({ cols }) => (
  <thead>
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      {cols.map(h => <th key={h} className="text-left pb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text4)' }}>{h}</th>)}
    </tr>
  </thead>
)

// ─────────────────────────────────────────────────────────────
// WITHDRAWAL
// ─────────────────────────────────────────────────────────────
export function Withdrawal() {
  const { user, addToast } = useStore()
  const [method,     setMethod]     = useState('bank')
  const [withdrawals,setWithdrawals]= useState([])
  const [accounts,   setAccounts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [amount,     setAmount]     = useState('')
  const [selectedAcc,setSelectedAcc]= useState(null)

  useEffect(() => {
    Promise.all([
      transactionsApi.list({ type: 'withdrawal', per_page: 20 }),
      accountsApi.list(),
    ]).then(([txRes, accRes]) => {
      const txns = txRes?.data?.transactions || []
      const accs  = accRes?.data?.accounts   || []
      setWithdrawals(txns)
      setAccounts(accs)
      const def = accs.find(a => a.is_default) || accs[0]
      if (def) { setSelectedAcc(def); setMethod(def.type) }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleWithdraw = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) < 20) return addToast('Minimum withdrawal is $20', 'warning')
    if (!selectedAcc) return addToast('Please add a withdrawal account first', 'warning')
    setSubmitting(true)
    try {
      await transactionsApi.createWithdrawal({ amount: parseFloat(amount), account_id: selectedAcc.id })
      addToast('Withdrawal request submitted!', 'success')
      setAmount('')
      const res = await transactionsApi.list({ type: 'withdrawal', per_page: 20 })
      setWithdrawals(res?.data?.transactions || [])
    } catch (err) { addToast(err.message || 'Withdrawal failed', 'error') }
    finally { setSubmitting(false) }
  }

  const accountLabel = (acc) => acc
    ? acc.type === 'bank'
      ? `${acc.bank_name} — Acc ending ${String(acc.account_number || '').slice(-4)}`
      : `${acc.coin} (${acc.network})`
    : 'No account selected'

  return (
    <DashboardLayout title="Withdraw Funds">
      <div className="card mb-5" style={{ background: 'linear-gradient(to right, var(--bg3), var(--card2))' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--text3)' }}>Available Balance</div>
        <div className="font-display font-black text-3xl text-neon">{fmt(user?.balance || 0)}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--text4)' }}>Min withdrawal: $20</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text)' }}>Withdrawal Details</h3>
          {accounts.length > 0 && (
            <div className="tabs mb-5">
              {accounts.filter(a => a.type === 'bank').length  > 0 && <div className={`tab ${method==='bank'   ? 'active':''}`} onClick={() => { setMethod('bank');   const a = accounts.find(x=>x.type==='bank');   if(a) setSelectedAcc(a) }}>🏦 Bank</div>}
              {accounts.filter(a => a.type === 'crypto').length > 0 && <div className={`tab ${method==='crypto' ? 'active':''}`} onClick={() => { setMethod('crypto'); const a = accounts.find(x=>x.type==='crypto'); if(a) setSelectedAcc(a) }}>₿ Crypto</div>}
            </div>
          )}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="label">Withdrawal Account</label>
              {accounts.length === 0 ? (
                <div className="rounded-lg p-3 text-sm" style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text3)' }}>
                  No withdrawal accounts yet.
                </div>
              ) : (
                <select className="input" value={selectedAcc?.id || ''} onChange={e => setSelectedAcc(accounts.find(a => a.id === parseInt(e.target.value)))}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{accountLabel(a)}</option>)}
                </select>
              )}
              <Link to="/add-account" className="inline-flex items-center gap-1 text-xs text-neon mt-2 hover:underline">
                <Plus size={12} /> Add Account
              </Link>
            </div>
            <div>
              <label className="label">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: 'var(--text4)' }}>$</span>
                <input className="input pl-7" type="number" placeholder="Enter amount" min="20" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>
            <div className="rounded-xl p-3 space-y-2 text-xs" style={{ background: 'var(--bg3)' }}>
              <div className="flex justify-between" style={{ color: 'var(--text3)' }}><span>Processing Fee</span><span className="text-neon">0%</span></div>
              <div className="flex justify-between" style={{ color: 'var(--text3)' }}><span>Est. Arrival</span><span>{method === 'bank' ? '1-3 business days' : '< 1 hour'}</span></div>
            </div>
            <button type="submit" disabled={submitting || !selectedAcc} className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><ArrowUpCircle size={16} /> Withdraw Funds</>}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Important Notes</h3>
          <div className="space-y-3">
            {[
              { icon: '⚡', title: 'Crypto Withdrawals', desc: 'Processed within 1 hour, 24/7' },
              { icon: '🏦', title: 'Bank Transfers',     desc: '1-3 business days, Mon-Fri' },
              { icon: '✅', title: 'Minimum Amount',     desc: 'At least $20 per withdrawal' },
              { icon: '📞', title: 'Support',            desc: 'Issues? Contact support within 24hrs' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{n.icon}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{n.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-sm sm:text-base mb-4" style={{ color: 'var(--text)' }}>Withdrawal History</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[400px]">
            <TableHead cols={['ID','Amount','Account','Status','Date']} />
            <tbody>
              {loading ? <SkeletonRows n={3} cols={5} />
                : withdrawals.length === 0
                  ? <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: 'var(--text4)' }}>No withdrawals yet</td></tr>
                  : withdrawals.map(t => (
                    <tr key={t.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 font-mono text-xs" style={{ color: 'var(--text4)' }}>{t.txn_code}</td>
                      <td className="py-3 font-bold text-red-400">-{fmt(t.amount)}</td>
                      <td className="py-3" style={{ color: 'var(--text3)' }}>{t.method || '—'}</td>
                      <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(t.created_at)}</td>
                    </tr>
                  ))
              }
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
  const [copied,  setCopied]  = useState(false)
  const [loading, setLoading] = useState(true)
  const [data,    setData]    = useState(null)

  useEffect(() => {
    referralsApi.get()
      .then(r => setData(r?.data || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const refLink = data?.referral_link || `${import.meta.env.VITE_URL}/ref/${data?.referral_code || ''}`
  const stats   = data?.stats    || { total: 0, active: 0, total_earned: 0, earned_this_month: 0 }
  const refs    = data?.referrals || []

  const handleCopy = () => {
    navigator.clipboard?.writeText(refLink).catch(() => {})
    setCopied(true)
    addToast('Referral link copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout title="Referral Program">
      <div className="card mb-5 p-5 sm:p-6 text-center" style={{ border: '1px solid color-mix(in srgb, var(--neon) 20%, transparent)', background: 'color-mix(in srgb, var(--neon) 5%, transparent)' }}>
        <div className="text-4xl mb-3">🎁</div>
        <h2 className="font-display font-black text-xl sm:text-2xl mb-2" style={{ color: 'var(--text)' }}>Earn 5% Forever</h2>
        <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: 'var(--text3)' }}>
          Share your link. Earn 5% commission on every deposit your referrals make — for life.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input readOnly value={loading ? 'Loading...' : refLink} className="input text-xs flex-1 text-center" />
          <button className="btn-primary px-4 flex-shrink-0" onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {loading
          ? Array(4).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-20 rounded-lg" /></div>)
          : [
              { label: 'Total Referrals', val: stats.total,          color: '#60a5fa' },
              { label: 'Active',          val: stats.active,         color: 'var(--neon)' },
              { label: 'Total Earned',    val: fmt(stats.total_earned), color: '#fbbf24' },
              { label: 'This Month',      val: fmt(stats.earned_this_month), color: '#a78bfa' },
            ].map(s => (
              <div key={s.label} className="card text-center py-4">
                <div className="font-display font-black text-2xl sm:text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text4)' }}>{s.label}</div>
              </div>
            ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-display font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Your Referrals</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[340px]">
              <TableHead cols={['User','Joined','Status','Earned']} />
              <tbody>
                {loading ? <SkeletonRows n={4} cols={4} />
                  : refs.length === 0
                    ? <tr><td colSpan={4} className="py-8 text-center text-sm" style={{ color: 'var(--text4)' }}>No referrals yet. Share your link!</td></tr>
                    : refs.map((r, i) => (
                      <tr key={i} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Avatar text={(r.full_name || r.username || 'U').slice(0,2).toUpperCase()} size="xs" />
                            <div>
                              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.full_name}</div>
                              <div className="text-[10px]" style={{ color: 'var(--text4)' }}>@{r.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-xs" style={{ color: 'var(--text3)' }}>{fmtDate(r.joined_at)}</td>
                        <td className="py-3"><span className={r.status === 'active' ? 'badge-green' : 'badge-blue'}>{r.status}</span></td>
                        <td className="py-3 font-bold text-neon">{fmt(r.commission_earned)}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>How Referrals Work</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Share your unique referral link with friends' },
              { step: '2', text: 'Friend clicks your link and registers on VoteAI' },
              { step: '3', text: 'They make their first deposit (any amount)' },
              { step: '4', text: 'You earn 5% commission — instantly credited' },
              { step: '5', text: 'Earn 5% on ALL their future deposits forever!' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5 text-neon"
                  style={{ background: 'color-mix(in srgb, var(--neon) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon) 25%, transparent)' }}>
                  {s.step}
                </div>
                <div className="text-sm pt-1" style={{ color: 'var(--text3)' }}>{s.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl p-3 text-xs" style={{ background: 'color-mix(in srgb, var(--neon) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--neon) 20%, transparent)', color: 'var(--neon)' }}>
            💡 No cap on earnings! Every active referral earns you passive income forever.
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
  const { darkMode, toggleTheme, addToast, user, setUser } = useStore()
  const [toggles,  setToggles]  = useState({ results: true, deposits: true, withdrawals: true, referrals: false, promos: false })
  const [accounts, setAccounts] = useState([])
  const [saving,   setSaving]   = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [profile,  setProfile]  = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [pwFields, setPwFields] = useState({ current_password: '', new_password: '', confirm: '' })
  const [pwError,  setPwError]  = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    accountsApi.list().then(r => setAccounts(r?.data?.accounts || [])).catch(() => {})
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await authApi.updateProfile(profile)
      if (res?.data) setUser(res.data)
      addToast('Profile updated!', 'success')
    } catch (err) { addToast(err.message || 'Update failed', 'error') }
    finally { setSaving(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    if (pwFields.new_password !== pwFields.confirm) { setPwError('Passwords do not match'); return }
    if (pwFields.new_password.length < 8) { setPwError('New password must be at least 8 characters'); return }
    setSavingPw(true)
    try {
      await authApi.changePassword({ current_password: pwFields.current_password, new_password: pwFields.new_password })
      addToast('Password changed!', 'success')
      setPwFields({ current_password: '', new_password: '', confirm: '' })
    } catch (err) { setPwError(err.message || 'Password change failed') }
    finally { setSavingPw(false) }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await authApi.uploadAvatar(file)
      if (res?.data?.avatar_url) { setUser({ ...user, avatar_url: res.data.avatar_url }); addToast('Avatar updated!', 'success') }
    } catch { addToast('Avatar upload failed', 'error') }
  }

  const handleRemoveAccount = async (id) => {
    try {
      await accountsApi.remove(id)
      setAccounts(p => p.filter(a => a.id !== id))
      addToast('Account removed', 'success')
    } catch (err) { addToast(err.message || 'Failed to remove', 'error') }
  }

  const accountLabel = (acc) => acc.type === 'bank'
    ? `${acc.bank_name} — Acc ending ${String(acc.account_number || '').slice(-4)}`
    : `${acc.coin} — ${String(acc.wallet_address || '').slice(0, 8)}...`

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <div className="card">
          <h3 className="font-display font-bold text-base mb-5" style={{ color: 'var(--text)' }}>Profile Settings</h3>
          <form onSubmit={handleSaveProfile}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-black flex-shrink-0 overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#00ff9d,#1e90ff)' }}>
                {user?.avatar_url
                  ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  : (user?.full_name || user?.username || 'U').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button type="button" className="btn-ghost text-xs" onClick={() => fileRef.current?.click()}>
                  <Upload size={13} /> Change Photo
                </button>
                <div className="text-xs mt-1" style={{ color: 'var(--text4)' }}>Max 2MB · JPG, PNG, WebP</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Username <span className="normal-case font-normal tracking-normal" style={{ color: 'var(--text4)' }}>(cannot change)</span></label>
                <input className="input" value={user?.username || ''} disabled style={{ opacity: 0.6 }} />
              </div>
              <div>
                <label className="label">Email <span className="normal-case font-normal tracking-normal" style={{ color: 'var(--text4)' }}>(cannot change)</span></label>
                <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="card">
          <h3 className="font-display font-bold text-base mb-5" style={{ color: 'var(--text)' }}>Change Password</h3>
          {pwError && <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400">{pwError}</div>}
          <form onSubmit={handleChangePassword} className="space-y-4 mb-5">
            <div><label className="label">Current Password</label><input className="input" type="password" placeholder="••••••••" value={pwFields.current_password} onChange={e => setPwFields(p => ({ ...p, current_password: e.target.value }))} /></div>
            <div><label className="label">New Password</label><input className="input" type="password" placeholder="Min 8 characters" value={pwFields.new_password} onChange={e => setPwFields(p => ({ ...p, new_password: e.target.value }))} /></div>
            <div><label className="label">Confirm New Password</label><input className="input" type="password" placeholder="Repeat new password" value={pwFields.confirm} onChange={e => setPwFields(p => ({ ...p, confirm: e.target.value }))} /></div>
            <button type="submit" disabled={savingPw} className="btn-primary text-sm disabled:opacity-60">
              {savingPw ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="font-display font-bold text-base mb-5" style={{ color: 'var(--text)' }}>Notifications</h3>
          {[
            { key: 'results',     label: 'Round Results',  desc: 'When your voting round result is ready' },
            { key: 'deposits',    label: 'Deposits',       desc: 'When deposit is confirmed' },
            { key: 'withdrawals', label: 'Withdrawals',    desc: 'When withdrawal is processed' },
            { key: 'referrals',   label: 'New Referrals',  desc: 'When someone uses your referral code' },
            { key: 'promos',      label: 'Promotions',     desc: 'News, offers and updates' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{n.label}</div>
                <div className="text-xs" style={{ color: 'var(--text4)' }}>{n.desc}</div>
              </div>
              <div className={`toggle ${toggles[n.key] ? 'on' : ''}`} onClick={() => setToggles(p => ({ ...p, [n.key]: !p[n.key] }))}>
                <div className="toggle-thumb" />
              </div>
            </div>
          ))}
        </div>

        {/* Appearance */}
        <div className="card">
          <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text)' }}>Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Dark Mode</div>
              <div className="text-xs" style={{ color: 'var(--text4)' }}>Currently: {darkMode ? 'Dark' : 'Light'} theme</div>
            </div>
            <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={toggleTheme}><div className="toggle-thumb" /></div>
          </div>
        </div>

        {/* Withdrawal accounts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>Withdrawal Accounts</h3>
            <Link to="/add-account" className="btn-primary text-xs px-3 py-1.5"><Plus size={13} /> Add</Link>
          </div>
          {accounts.length === 0
            ? <div className="text-sm text-center py-4" style={{ color: 'var(--text4)' }}>No accounts yet. <Link to="/add-account" className="text-neon hover:underline">Add one</Link></div>
            : accounts.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ background: 'var(--bg3)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.type === 'bank' ? '🏦' : '₿'}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{accountLabel(a)}</div>
                    <div className="text-xs" style={{ color: 'var(--text4)' }}>{a.type === 'bank' ? a.country : a.network}{a.is_default ? ' · Default' : ''}</div>
                  </div>
                </div>
                <button className="btn-icon w-7 h-7" style={{ color: '#f87171' }} onClick={() => handleRemoveAccount(a.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          }
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
  const [rounds,  setRounds]  = useState([])
  const [loading, setLoading] = useState(true)
  const [status,  setStatus]  = useState('')

  const fetchRounds = (s = '') => {
    setLoading(true)
    const params = s ? { status: s } : {}
    roundsApi.list(params)
      .then(r => setRounds(r?.data?.rounds || []))
      .catch(() => addToast('Could not load rounds', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRounds() }, [])

  const handleFilter = (s) => { setStatus(s); fetchRounds(s) }

  return (
    <DashboardLayout title="Vote Rounds">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {['', 'live', 'upcoming', 'ended'].map(s => (
            <button key={s} onClick={() => handleFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${status === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => fetchRounds(status)} className="btn-ghost text-xs">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-64 rounded-xl" /></div>)}
        </div>
      ) : rounds.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-4xl mb-3">🎮</div>
          <div className="font-display font-bold text-base mb-2" style={{ color: 'var(--text)' }}>No rounds found</div>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>Check back soon for new voting rounds!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rounds.map((round, ri) => {
            const images = round.images || []
            const userVotedImg = images.find(img => img.user_voted)
            return (
              <div key={ri} className="card card-hover card-glow">
                <div className="flex justify-between items-start mb-3">
                  <span className={round.status === 'live' ? 'badge-green' : round.status === 'upcoming' ? 'badge-yellow' : 'badge-blue'}>
                    {round.status === 'live' ? '🔴' : round.status === 'upcoming' ? '🟡' : '✅'} {round.status}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text4)' }}>{round.round_code}</span>
                </div>
                <h3 className="font-display font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>{round.theme}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--bg3)' }}>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text4)' }}>Prize</div>
                    <div className="font-display font-black text-base text-neon">{fmt(round.prize_pool)}</div>
                  </div>
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--bg3)' }}>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text4)' }}>Voters</div>
                    <div className="font-display font-black text-base" style={{ color: 'var(--text)' }}>{(round.total_voters || 0).toLocaleString()}</div>
                  </div>
                </div>
                {round.status !== 'ended' && round.seconds_left > 0 && (
                  <div className="mb-3 flex justify-center"><Countdown seconds={round.seconds_left} size="sm" /></div>
                )}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {images.map((img, i) => (
                      <VoteImageCard key={img.id} image={{
                        id: img.id, label: img.label, emoji: img.emoji || '🖼️',
                        desc: img.description, votes: img.vote_count || 0,
                        color: img.color || '#00ff9d', bg: img.bg_gradient || 'linear-gradient(135deg,#1a1a2e,#16213e)'
                      }} index={i} locked
                        isWinner={round.status === 'ended' && img.is_winner}
                        selected={img.user_voted}
                        showVotes={round.status === 'ended'} />
                    ))}
                  </div>
                )}
                {round.status === 'ended' && userVotedImg !== undefined && (
                  <div className={`text-center text-xs font-bold py-1.5 rounded-lg mb-2 ${userVotedImg?.is_winner ? 'text-neon' : 'text-red-400'}`}
                    style={{ background: userVotedImg?.is_winner ? 'color-mix(in srgb, var(--neon) 15%, transparent)' : 'rgba(239,68,68,0.15)' }}>
                    {userVotedImg?.is_winner ? '✅ You Won!' : '❌ You Lost'}
                  </div>
                )}
                {round.status === 'live' && (
                  <Link to="/dashboard" className="btn-primary w-full justify-center text-sm">Vote Now →</Link>
                )}
                {round.status === 'upcoming' && (
                  <button className="btn-ghost w-full justify-center text-sm" onClick={() => addToast('Reminder set! 🔔', 'success')}>
                    Set Reminder 🔔
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// HISTORY
// ─────────────────────────────────────────────────────────────
export function History() {
  const [txns,    setTxns]    = useState([])
  const [loading, setLoading] = useState(true)
  const [type,    setType]    = useState('')
  const [page,    setPage]    = useState(1)
  const [meta,    setMeta]    = useState(null)

  const fetchTxns = (t = type, p = 1) => {
    setLoading(true)
    const params = { page: p, per_page: 20 }
    if (t) params.type = t
    transactionsApi.list(params)
      .then(r => { setTxns(r?.data?.transactions || []); setMeta(r?.data?.meta || null) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTxns() }, [])

  const handleFilter = (t) => { setType(t); setPage(1); fetchTxns(t, 1) }

  return (
    <DashboardLayout title="Transaction History">
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>All Transactions</h3>
          <div className="flex gap-2 flex-wrap">
            {[{v:'',l:'All'},{v:'deposit',l:'Deposits'},{v:'withdrawal',l:'Withdrawals'},{v:'win',l:'Winnings'},{v:'referral_commission',l:'Referral'}].map(o => (
              <button key={o.v} onClick={() => handleFilter(o.v)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${type === o.v ? 'btn-primary' : 'btn-ghost'}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[460px]">
            <TableHead cols={['ID','Type','Amount','Method','Status','Date']} />
            <tbody>
              {loading ? <SkeletonRows n={5} cols={6} />
                : txns.length === 0
                  ? <tr><td colSpan={6} className="py-10 text-center text-sm" style={{ color: 'var(--text4)' }}>No transactions found</td></tr>
                  : txns.map(t => (
                    <tr key={t.id} className="hover:bg-white/3 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-3 font-mono text-[10px]" style={{ color: 'var(--text4)' }}>{t.txn_code}</td>
                      <td className="py-3"><span className={t.type === 'deposit' ? 'badge-blue' : t.type === 'win' ? 'badge-gold' : t.type === 'referral_commission' ? 'badge-purple' : 'badge-purple'}>{t.type.replace('_', ' ')}</span></td>
                      <td className="py-3 font-bold" style={{ color: t.type === 'withdrawal' ? '#f87171' : 'var(--neon)' }}>
                        {t.type === 'withdrawal' ? '-' : '+'}{fmt(t.amount)}
                      </td>
                      <td className="py-3" style={{ color: 'var(--text3)' }}>{t.method || '—'}</td>
                      <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : t.status === 'rejected' ? 'badge-red' : 'badge-yellow'}>{t.status}</span></td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(t.created_at)}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).slice(0, 7).map(p => (
              <button key={p} onClick={() => { setPage(p); fetchTxns(type, p) }}
                className="min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors border"
                style={{ background: p === page ? 'var(--neon)' : 'transparent', color: p === page ? '#000' : 'var(--text4)', borderColor: p === page ? 'var(--neon)' : 'var(--border)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export function Notifications() {
  const { addToast } = useStore()
  const [notifs,   setNotifs]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [unread,   setUnread]   = useState(0)

  const fetchNotifs = () => {
    notificationsApi.list()
      .then(r => { setNotifs(r?.data?.notifications || []); setUnread(r?.data?.unread_count || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotifs() }, [])

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead()
      setNotifs(p => p.map(n => ({ ...n, is_read: 1 })))
      setUnread(0)
      addToast('All notifications marked as read', 'success')
    } catch { addToast('Failed to update', 'error') }
  }

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm" style={{ color: 'var(--text3)' }}>
            {unread > 0 ? <span className="badge-red">{unread} unread</span> : 'All caught up!'}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-xs">Mark all read</button>
          )}
        </div>
        <div className="space-y-2">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="card"><div className="skeleton h-14 rounded-xl" /></div>)
            : notifs.length === 0
              ? (
                <div className="card text-center py-14">
                  <div className="text-4xl mb-3">🔔</div>
                  <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>No notifications yet</div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text4)' }}>We'll notify you about votes, deposits, and wins</p>
                </div>
              )
              : notifs.map((n, i) => (
                <div key={i} className="card flex items-start gap-4"
                  style={!n.is_read ? { border: '1px solid color-mix(in srgb, var(--neon) 20%, transparent)', background: 'color-mix(in srgb, var(--neon) 5%, transparent)' } : {}}>
                  <span className="text-2xl mt-0.5 flex-shrink-0">{n.icon || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{n.title}</div>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text4)' }}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{n.body}</div>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-neon rounded-full flex-shrink-0 mt-1.5" />}
                </div>
              ))
          }
        </div>
      </div>
    </DashboardLayout>
  )
}
