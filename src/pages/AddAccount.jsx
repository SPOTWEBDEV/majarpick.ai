import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { accountsApi } from '../services/api'
import { Cpu, Building2, Coins, Loader2 } from 'lucide-react'

export default function AddAccount() {
  const navigate = useNavigate()
  const { addToast } = useStore()
  const [tab,      setTab]      = useState('bank')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [bank,     setBank]     = useState({ country: 'United States', bank_name: '', account_name: '', account_number: '', routing_number: '' })
  const [crypto,   setCrypto]   = useState({ coin: 'USDT (Tether)', wallet_address: '', network: 'TRC20 (TRON)' })

  const setB = (k, v) => setBank(p  => ({ ...p, [k]: v }))
  const setC = (k, v) => setCrypto(p => ({ ...p, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'bank') {
        if (!bank.bank_name || !bank.account_name || !bank.account_number)
          throw new Error('Bank name, account name and account number are required')
        await accountsApi.create({ type: 'bank', ...bank })
      } else {
        if (!crypto.wallet_address)
          throw new Error('Wallet address is required')
        await accountsApi.create({ type: 'crypto', ...crypto })
      }
      addToast('Withdrawal account saved! Welcome to VoteAI 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Could not save account')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => navigate('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--neon) 6%, transparent) 0%, transparent 60%)' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg relative">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-neon rounded-xl flex items-center justify-center">
              <Cpu size={18} className="text-black" />
            </div>
            <span className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Vote<span className="text-neon">AI</span></span>
          </Link>
          <h2 className="font-display font-black text-xl mt-4" style={{ color: 'var(--text)' }}>Add Withdrawal Account</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Where should we send your winnings?</p>
        </div>

        <div className="card p-6 sm:p-8">
          {error && <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400">{error}</div>}

          {/* Tab selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ id: 'bank', label: 'Bank Account', icon: Building2 }, { id: 'crypto', label: 'Crypto Wallet', icon: Coins }].map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-semibold text-sm transition-all ${
                  tab === t.id ? 'border-neon text-neon' : 'text-gray-400 hover:text-gray-300'}`}
                style={tab === t.id
                  ? { borderColor: 'var(--neon)', background: 'color-mix(in srgb, var(--neon) 10%, transparent)' }
                  : { borderColor: 'var(--border2)', background: 'transparent' }}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <AnimatePresence mode="wait">
              {tab === 'bank' ? (
                <motion.div key="bank" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  <div>
                    <label className="label">Country</label>
                    <select className="input" value={bank.country} onChange={e => setB('country', e.target.value)}>
                      {['United States','Nigeria','United Kingdom','Canada','Australia','Germany','France','Ghana','Kenya','South Africa'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Bank Name</label>
                    <input className="input" placeholder="e.g. Chase Bank" value={bank.bank_name} onChange={e => setB('bank_name', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Account Name</label>
                      <input className="input" placeholder="John Doe" value={bank.account_name} onChange={e => setB('account_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Account Number</label>
                      <input className="input" placeholder="0000000000" value={bank.account_number} onChange={e => setB('account_number', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Routing / Sort Code <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--text4)' }}>(optional)</span></label>
                    <input className="input" placeholder="For US/UK banks" value={bank.routing_number} onChange={e => setB('routing_number', e.target.value)} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="crypto" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="label">Cryptocurrency</label>
                    <select className="input" value={crypto.coin} onChange={e => setCrypto(p => ({ ...p, coin: e.target.value }))}>
                      {['USDT (Tether)','Bitcoin (BTC)','Ethereum (ETH)','BNB','USDC'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Wallet Address</label>
                    <input className="input" placeholder="0x... or T..." value={crypto.wallet_address} onChange={e => setC('wallet_address', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Network</label>
                    <select className="input" value={crypto.network} onChange={e => setC('network', e.target.value)}>
                      {['TRC20 (TRON)','ERC20 (Ethereum)','BEP20 (BSC)','Bitcoin Network'].map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                    ⚠️ Double-check your wallet address and network. Wrong address = lost funds.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Save & Continue'}
              </button>
              <button type="button" onClick={handleSkip} className="btn-ghost px-5">Skip</button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text4)' }}>You can add or change accounts anytime in Settings</p>
      </motion.div>
    </div>
  )
}
