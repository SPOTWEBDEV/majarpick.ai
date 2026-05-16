import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { MOCK_TRANSACTIONS, MOCK_USER, fmt, fmtDate } from '../data/mockData'
import DashboardLayout from '../layouts/DashboardLayout'
import { Copy, Check } from 'lucide-react'

const bankDetails = [
  { label: 'Bank Name', value: 'First National Bank' },
  { label: 'Account Name', value: 'VoteAI Ltd' },
  { label: 'Account Number', value: '0123 4567 8901' },
  { label: 'Routing Number', value: '021000021' },
  { label: 'Reference', value: MOCK_USER.username.toUpperCase() },
]

const cryptoOptions = [
  { coin: 'USDT (TRC20)', address: 'TXmJ2kHp3...4Kp8', qr: '💠', color: '#26a17b', network: 'TRON TRC20' },
  { coin: 'Bitcoin (BTC)', address: '1BvBMSEYstWet...qTvNnjtLP', qr: '🟠', color: '#f7931a', network: 'Bitcoin Network' },
  { coin: 'Ethereum (ETH)', address: '0x742d35Cc6634...e4a3', qr: '🔵', color: '#627eea', network: 'ERC20' },
  { coin: 'USDT (BEP20)', address: '0xb8c2...a91F', qr: '🟡', color: '#f3ba2f', network: 'BSC BEP20' },
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="btn-icon w-7 h-7 flex-shrink-0">
      {copied ? <Check size={13} className="text-neon" /> : <Copy size={13} />}
    </button>
  )
}

export default function Deposit() {
  const { addToast } = useStore()
  const [tab, setTab] = useState('bank')
  const deposits = MOCK_TRANSACTIONS.filter(t => t.type === 'deposit')

  return (
    <DashboardLayout title="Deposit Funds">
      {/* Balance card */}
      <div className="card border-white/12 mb-5 bg-gradient-to-r from-dark-3 to-card-2">
        <div className="text-xs text-white/40 mb-1">Current Balance</div>
        <div className="font-display font-black text-3xl text-neon">{fmt(MOCK_USER.balance)}</div>
        <div className="text-xs text-white/30 mt-1">Min deposit: $10 · Credits instantly after confirmation</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Deposit form */}
        <div>
          <div className="tabs mb-4">
            <div className={`tab ${tab === 'bank' ? 'active' : ''}`} onClick={() => setTab('bank')}>🏦 Bank Transfer</div>
            <div className={`tab ${tab === 'crypto' ? 'active' : ''}`} onClick={() => setTab('crypto')}>₿ Crypto</div>
          </div>

          {tab === 'bank' && (
            <div className="card border-white/12">
              <h3 className="font-display font-bold text-base mb-4">Bank Transfer Details</h3>
              <div className="space-y-0 mb-4">
                {bankDetails.map(d => (
                  <div key={d.label} className="flex items-center justify-between py-3 border-b border-white/8">
                    <span className="text-sm text-white/40">{d.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{d.value}</span>
                      <CopyButton text={d.value} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-neon/8 border border-neon/20 rounded-xl p-3 text-xs text-neon/80">
                ⚠️ Always include your username <strong className="text-neon">{MOCK_USER.username.toUpperCase()}</strong> as payment reference for instant credit.
              </div>
            </div>
          )}

          {tab === 'crypto' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cryptoOptions.map((c, i) => (
                <div key={i} className="card card-hover border-white/12">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{c.qr}</span>
                    <div>
                      <div className="text-sm font-bold">{c.coin}</div>
                      <div className="text-[10px] text-white/30">{c.network}</div>
                    </div>
                  </div>
                  {/* QR placeholder */}
                  <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-4xl mb-3 mx-auto">
                    {c.qr}
                  </div>
                  <div className="bg-dark-3 rounded-lg p-2 text-[10px] font-mono text-white/40 break-all mb-2">{c.address}</div>
                  <button className="btn-ghost w-full justify-center text-xs" onClick={() => addToast('Address copied!', 'success')}>
                    <Copy size={12} /> Copy Address
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notice / info */}
        <div className="space-y-4">
          <div className="card border-white/12">
            <h3 className="font-display font-bold text-sm mb-4">Deposit Notes</h3>
            <div className="space-y-3">
              {[
                { icon: '⚡', title: 'Instant Credit', desc: 'Crypto deposits credit after 1 network confirmation.' },
                { icon: '🏦', title: 'Bank Transfers', desc: '1-2 business days after payment is received.' },
                { icon: '🔒', title: 'Secure & Safe', desc: 'All funds protected with 256-bit SSL encryption.' },
                { icon: '💬', title: 'Need Help?', desc: 'Contact support if deposit not credited within 2 hours.' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{n.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-xs text-white/40">{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit history */}
      <div className="card border-white/12">
        <h3 className="font-display font-bold text-sm sm:text-base mb-4">Deposit History</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-white/8">
                {['ID', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left pb-3 text-[10px] font-bold text-white/30 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deposits.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="py-3 font-mono text-xs text-white/30">{t.id}</td>
                  <td className="py-3 font-bold text-neon">{fmt(t.amount)}</td>
                  <td className="py-3 text-white/40">{t.method}</td>
                  <td className="py-3"><span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span></td>
                  <td className="py-3 text-white/30 text-xs">{fmtDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {deposits.length === 0 && (
            <div className="text-center py-10 text-white/30 text-sm">No deposits yet</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
