import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { roundsApi, transactionsApi } from '../services/api'
import DashboardLayout from '../layouts/DashboardLayout'
import VoteImageCard from '../components/VoteImageCard'
import Countdown from '../components/Countdown'
import StatCard from '../components/StatCard'
import Avatar from '../components/Avatar'
import { DollarSign, Trophy, Gamepad2, TrendingUp, Crown, Loader2 } from 'lucide-react'
import { fmt, fmtDate } from '../data/mockData'

export default function Dashboard() {
  const { user, currentRound, setCurrentRound, selectImage: storeSelectImage,
          setResult, resetRound, tickCountdown, addToast } = useStore()

  const [roundLoading,  setRoundLoading]  = useState(true)
  const [txnLoading,    setTxnLoading]    = useState(true)
  const [winnersLoading,setWinnersLoading]= useState(true)
  const [leaderLoading, setLeaderLoading] = useState(true)
  const [transactions,  setTransactions]  = useState([])
  const [recentWinners, setRecentWinners] = useState([])
  const [leaderboard,   setLeaderboard]   = useState([])
  const [voting,        setVoting]        = useState(false)

  // ── Fetch live round ───────────────────────────────────────
  const fetchLiveRound = useCallback(async () => {
    try {
      const res = await roundsApi.live()
      if (res?.data) setCurrentRound(res.data)
    } catch { /* no live round */ }
    finally { setRoundLoading(false) }
  }, [])

  // ── Fetch supporting data ─────────────────────────────────
  useEffect(() => {
    fetchLiveRound()

    transactionsApi.list({ per_page: 5 })
      .then(r => setTransactions(r?.data?.transactions || []))
      .catch(() => {})
      .finally(() => setTxnLoading(false))

    roundsApi.recentWinners()
      .then(r => setRecentWinners(r?.data?.winners || []))
      .catch(() => {})
      .finally(() => setWinnersLoading(false))

    roundsApi.leaderboard()
      .then(r => setLeaderboard(r?.data?.leaderboard?.slice(0, 4) || []))
      .catch(() => {})
      .finally(() => setLeaderLoading(false))
  }, [fetchLiveRound])

  // ── Countdown tick ─────────────────────────────────────────
  useEffect(() => {
    if (!currentRound.id || currentRound.phase === 'result') return
    const interval = setInterval(() => {
      tickCountdown()
      const cd = useStore.getState().currentRound.countdown
      if (cd === 0 && useStore.getState().currentRound.phase === 'select') {
        // Fetch actual results from API
        roundsApi.results(currentRound.id)
          .then(r => {
            if (r?.data?.winner_image_id) {
              setResult(r.data.winner_image_id)
              addToast('🎯 Results are in! Check your vote!', 'info')
            }
          })
          .catch(() => addToast('Round ended — refreshing...', 'info'))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [currentRound.id, currentRound.phase])

  // ── Vote handler ───────────────────────────────────────────
  const handleVote = async (imageId) => {
    if (!currentRound.id || currentRound.locked || voting) return
    setVoting(true)
    try {
      await roundsApi.vote(currentRound.id, imageId)
      storeSelectImage(imageId)
    } catch (err) {
      addToast(err.message || 'Could not record vote', 'error')
    } finally {
      setVoting(false)
    }
  }

  const won = currentRound.phase === 'result'
    && currentRound.result !== null
    && currentRound.selectedImage !== null
    && currentRound.result === currentRound.selectedImage

  const displayUser = user || {}

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard label="Balance"        value={fmt(displayUser.balance      || 0)} icon={DollarSign} color="#00ff9d" change="+12.4% this week" />
        <StatCard label="Total Earnings" value={fmt(displayUser.total_earnings|| 0)} icon={Trophy}     color="#fbbf24" change="+8.1% this week" />
        <StatCard label="Total Votes"    value={displayUser.total_votes       || 0}  icon={Gamepad2}   color="#60a5fa" change="+3 today" />
        <StatCard label="Win Rate"       value={Math.round((displayUser.win_rate || 0) * 100) + '%'} icon={TrendingUp} color="#a78bfa" change="+2.1%" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
        {/* Game area */}
        <div className="lg:col-span-2 card">
          {roundLoading ? (
            <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text3)' }}>
              <Loader2 size={20} className="animate-spin text-neon" />
              <span className="text-sm">Loading live round...</span>
            </div>
          ) : !currentRound.id ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">⏳</div>
              <div className="font-display font-bold text-base mb-2" style={{ color: 'var(--text)' }}>No Live Round</div>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Check back soon — a new round starts shortly!</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text4)' }}>Current Round</div>
                  <h2 className="font-display font-bold text-base sm:text-lg" style={{ color: 'var(--text)' }}>
                    {currentRound.theme} #{currentRound.round_code}
                  </h2>
                </div>
                <span className="badge-green">🔴 Live</span>
              </div>

              {/* Round info bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-xl p-3 mb-4" style={{ background: 'var(--bg3)' }}>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text4)' }}>Prize Pool</div>
                  <div className="font-display font-black text-lg sm:text-xl text-neon">{fmt(currentRound.prize_pool || 0)}</div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--text4)' }}>Time Left</div>
                  <Countdown seconds={currentRound.countdown} size="sm" />
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text4)' }}>Voters</div>
                  <div className="font-display font-black text-lg sm:text-xl" style={{ color: 'var(--text)' }}>
                    {(currentRound.total_voters || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Result reveal */}
              {currentRound.phase === 'result' && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className={`mb-4 rounded-xl p-4 text-center border ${won ? 'result-win' : 'result-lose'}`}
                  style={won
                    ? { background: 'rgba(0,255,157,0.1)', borderColor: 'rgba(0,255,157,0.3)' }
                    : { background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
                  <div className="text-3xl mb-2">{won ? '🎉' : '😔'}</div>
                  <div className="font-display font-black text-lg" style={{ color: won ? 'var(--neon)' : '#f87171' }}>
                    {won ? 'You Won!' : currentRound.selectedImage === null ? 'Round Ended' : 'Not this time!'}
                  </div>
                  {won && <div className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Winnings credited to your balance!</div>}
                  {currentRound.selectedImage === null && (
                    <div className="text-sm mt-1" style={{ color: 'var(--text3)' }}>You didn't vote this round</div>
                  )}
                  <button onClick={() => fetchLiveRound()} className="btn-primary text-sm mt-3">Next Round →</button>
                </motion.div>
              )}

              {/* Instruction */}
              {currentRound.phase === 'select' && (
                <p className="text-xs sm:text-sm mb-3 text-center" style={{ color: 'var(--text4)' }}>
                  {currentRound.locked
                    ? '✅ Vote locked! Waiting for round to end...'
                    : '👆 Vote for the image you think MOST others will pick!'}
                </p>
              )}

              {/* Vote images */}
              {(currentRound.images || []).length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {currentRound.images.map((img, i) => (
                    <VoteImageCard
                      key={img.id}
                      image={{
                        id: img.id, label: img.label, emoji: img.emoji || '🖼️',
                        desc: img.description, votes: img.vote_count || 0,
                        color: img.color || '#00ff9d', bg: img.bg_gradient || 'linear-gradient(135deg,#1a1a2e,#16213e)'
                      }}
                      index={i}
                      selected={currentRound.selectedImage === img.id}
                      locked={currentRound.locked || voting}
                      isWinner={currentRound.phase === 'result' && currentRound.result === img.id}
                      onSelect={() => handleVote(img.id)}
                      showVotes={currentRound.phase === 'result'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm" style={{ color: 'var(--text4)' }}>Round images loading...</div>
              )}
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Recent winners */}
          <div className="card">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text4)' }}>Recent Winners</div>
            {winnersLoading
              ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-10 mb-2 rounded-lg" />)
              : recentWinners.length === 0
                ? <div className="text-xs text-center py-4" style={{ color: 'var(--text4)' }}>No winners yet</div>
                : recentWinners.slice(0, 4).map((w, i) => (
                  <div key={i} className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar text={(w.full_name || w.username || 'U').slice(0, 2).toUpperCase()} size="xs" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{w.username}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text4)' }}>{w.image_label}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-neon flex-shrink-0">{fmt(w.payout)}</div>
                  </div>
                ))
            }
          </div>

          {/* Leaderboard */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-yellow-400" />
              <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text4)' }}>Top Voters</div>
            </div>
            {leaderLoading
              ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-9 mb-2 rounded-lg" />)
              : leaderboard.map((p, i) => {
                const medals = ['🥇','🥈','🥉']
                const isYou  = user && p.id === user.id
                return (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg mb-1"
                    style={{ background: isYou ? 'color-mix(in srgb, var(--neon) 10%, transparent)' : 'transparent' }}>
                    <div className="text-sm font-black font-display w-6 text-center"
                      style={{ color: p.rank <= 3 ? '#fbbf24' : 'var(--text4)' }}>
                      {p.rank <= 3 ? medals[p.rank - 1] : `#${p.rank}`}
                    </div>
                    <Avatar text={(p.username || 'U').slice(0, 2).toUpperCase()} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: isYou ? 'var(--neon)' : 'var(--text)' }}>
                        {p.username}{isYou ? ' (You)' : ''}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text4)' }}>{p.win_count} wins</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-sm sm:text-base" style={{ color: 'var(--text)' }}>Recent Transactions</h3>
          <a href="/history" className="text-xs text-neon hover:underline">View all</a>
        </div>
        {txnLoading ? (
          <div className="space-y-2">{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Type','Amount','Method','Status','Date'].map(h => (
                    <th key={h} className="text-left pb-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: 'var(--text4)' }}>No transactions yet</td></tr>
                ) : transactions.map(t => (
                  <tr key={t.id} className="transition-colors hover:bg-white/3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3">
                      <span className={t.type === 'deposit' ? 'badge-blue' : t.type === 'win' ? 'badge-gold' : 'badge-purple'}>{t.type}</span>
                    </td>
                    <td className="py-3 font-bold" style={{ color: t.type === 'withdrawal' ? '#f87171' : 'var(--neon)' }}>
                      {t.type === 'withdrawal' ? '-' : '+'}{fmt(t.amount)}
                    </td>
                    <td className="py-3" style={{ color: 'var(--text3)' }}>{t.method || '—'}</td>
                    <td className="py-3">
                      <span className={t.status === 'completed' ? 'badge-green' : 'badge-yellow'}>{t.status}</span>
                    </td>
                    <td className="py-3 text-xs" style={{ color: 'var(--text4)' }}>{fmtDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
