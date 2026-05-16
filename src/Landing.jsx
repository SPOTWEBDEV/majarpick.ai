import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { AI_IMAGE_SETS, MOCK_WINNERS, TESTIMONIALS, FAQS, fmt } from '../data/mockData'
import VoteImageCard from '../components/VoteImageCard'
import Avatar from '../components/Avatar'
import {
  Cpu, Menu, X, Sun, Moon, Star, Shield, Trophy, Users,
  ChevronDown, Gift, Zap, ArrowRight, CheckCircle
} from 'lucide-react'

const steps = [
  { n: '01', title: 'Register Free', desc: 'Create your account in 60 seconds. No credit card needed to start.', color: '#00ff9d' },
  { n: '02', title: 'Fund Account', desc: 'Deposit via bank or crypto. Minimum $10 to join any voting round.', color: '#1e90ff' },
  { n: '03', title: 'Vote on AI Images', desc: 'Three scary AI images appear. Vote for whichever you think will get the most votes overall.', color: '#a78bfa' },
  { n: '04', title: 'Earn Rewards', desc: 'The image with the highest votes wins! All voters on the winning image share the prize pool.', color: '#fbbf24' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { darkMode, toggleTheme } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)
  const previewSet = AI_IMAGE_SETS[0]

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--bg) 90%, transparent)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
              <Cpu size={16} className="text-black" />
            </div>
            <span className="font-display font-black text-xl" style={{ color: 'var(--text)' }}>Vote<span className="text-neon">AI</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {['How It Works', 'Earn', 'Referral', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="nav-link">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-icon hidden sm:flex" onClick={toggleTheme}>
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Register Free</Link>
            <button className="btn-icon md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-4 py-4 flex flex-col gap-3"
            style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}
          >
            {['How It Works', 'Earn', 'Referral', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} onClick={() => setMenuOpen(false)}
                className="text-sm font-medium py-1" style={{ color: 'var(--text3)' }}>{l}</a>
            ))}
            <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <Link to="/login" className="btn-ghost flex-1 justify-center" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary flex-1 justify-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none hero-grad" style={{ background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--neon) 7%, transparent) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 hero-grid pointer-events-none" style={{ backgroundImage: 'linear-gradient(color-mix(in srgb, var(--text) 2%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--text) 2%, transparent) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: 'color-mix(in srgb, var(--neon) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--neon) 25%, transparent)', color: 'var(--neon)' }}>
            <Shield size={13} /> Earn Real Money · Help Train AI
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-5"
            style={{ color: 'var(--text)' }}>
            Vote on AI Images,<br /><span className="text-neon">Get Paid for It</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text3)' }}>
            Three AI-generated scary images. Vote for the one most others pick. The crowd-favorite wins — and all voters on it share the prize pool. You earn money while helping train AI.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link to="/register" className="btn-primary text-base px-8 py-3 w-full sm:w-auto justify-center">
              Start Earning Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-3 w-full sm:w-auto justify-center">
              Login to Account
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-12">
            {[
              { val: '$2.8M', label: 'Total Paid Out' },
              { val: '8,423', label: 'Active Voters' },
              { val: '47K+', label: 'Rounds Completed' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 sm:p-4 text-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="font-display font-black text-xl sm:text-2xl text-neon">{s.val}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--text4)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Live preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="max-w-md mx-auto">
            <div className="text-xs text-neon font-bold uppercase tracking-widest mb-3 text-center">🔴 Live Round Preview</div>
            <div className="card p-4">
              <div className="grid grid-cols-3 gap-3">
                {previewSet.images.map((img, i) => (
                  <VoteImageCard key={i} image={img} index={i} locked showVotes />
                ))}
              </div>
              <div className="mt-4 text-center text-xs" style={{ color: 'var(--text4)' }}>Vote for the scariest! 👆 Highest votes wins.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Winner ticker */}
      <div className="overflow-hidden py-2.5" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex whitespace-nowrap" style={{ animation: 'ticker 25s linear infinite' }}>
          {[...MOCK_WINNERS, ...MOCK_WINNERS].map((w, i) => (
            <div key={i} className="flex items-center gap-2 px-8 text-sm" style={{ color: 'var(--text4)' }}>
              <Trophy size={13} className="text-neon flex-shrink-0" />
              <span className="text-neon font-semibold">{w.name}</span>
              <span>won</span>
              <span className="text-neon font-semibold">{fmt(w.amount)}</span>
              <span>on {w.image}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>How It Works</h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--text3)' }}>Four simple steps from signup to earning</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card card-hover text-center p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 font-display font-black text-base" style={{ background: `color-mix(in srgb, ${s.color} 15%, transparent)`, color: s.color }}>
                  {s.n}
                </div>
                <h3 className="font-display font-bold text-base mb-2" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VoteAI */}
      <section id="earn" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="badge-green inline-flex mb-5"><Zap size={12} /> Why VoteAI?</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-5" style={{ color: 'var(--text)' }}>You Help AI Learn.<br />AI Helps You Earn.</h2>
              <p className="leading-relaxed mb-6 text-sm sm:text-base" style={{ color: 'var(--text3)' }}>
                AI researchers need human feedback to improve image generation quality. Your votes tell the AI which images feel more real, scarier, or more detailed. Every vote is data. Every round, you get paid.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'No skills needed — just your gut feeling',
                  'Every round lasts minutes, not hours',
                  'Withdraw earnings anytime via crypto or bank',
                  '5% lifetime commission on referrals',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text2)' }}>
                    <CheckCircle size={16} className="text-neon flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary inline-flex">Start Voting Free <ArrowRight size={15} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '$87.50', label: 'Avg payout per winning round', color: 'var(--neon)' },
                { val: '5%', label: 'Lifetime referral commission', color: '#1e90ff' },
                { val: '< 1hr', label: 'Crypto withdrawal time', color: '#a78bfa' },
                { val: '62%', label: 'Average win rate for top voters', color: '#fbbf24' },
              ].map((s, i) => (
                <div key={i} className="card card-glow">
                  <div className="font-display font-black text-2xl sm:text-3xl mb-1" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs leading-snug" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sample rounds */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>Sample Voting Rounds</h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text3)' }}>Each round shows 3 AI-generated images. Vote for the crowd favorite.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_IMAGE_SETS.map((set, si) => (
              <motion.div key={si} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: si * 0.1 }}
                className="card card-hover card-glow">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{set.theme}</span>
                  <span className="badge-green text-xs">Live</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {set.images.map((img, i) => (
                    <VoteImageCard key={i} image={img} index={i} locked showVotes />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text4)' }}>
                  <span><Users size={11} className="inline mr-1" />{(set.images.reduce((a, b) => a + b.votes, 0)).toLocaleString()} votes</span>
                  <span className="text-neon font-bold">$500 prize</span>
                </div>
                <Link to="/register" className="btn-primary w-full justify-center mt-3 text-sm">Join & Vote</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral */}
      <section id="referral" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="card p-6">
              <div className="text-center mb-5">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>Your Referral Link</h3>
              </div>
              <div className="flex gap-2 mb-6">
                <input readOnly value="https://voteai.io/ref/YOURCODE" className="input text-xs flex-1" />
                <button className="btn-primary text-sm px-3">Copy</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Refs', val: '12' },
                  { label: 'Active', val: '9' },
                  { label: 'Earned', val: '$360' },
                  { label: 'This Month', val: '$120' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg3)' }}>
                    <div className="font-display font-black text-lg text-neon">{s.val}</div>
                    <div className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: 'var(--text4)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="badge-gold inline-flex mb-5"><Gift size={12} /> Referral Program</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-4" style={{ color: 'var(--text)' }}>Earn 5% Forever</h2>
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--text3)' }}>
                Refer friends and earn 5% commission on every deposit they make — for life. The more active referrals, the more passive income you generate.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '🔗', text: 'Share your unique link' },
                  { icon: '👤', text: 'Friend registers and deposits' },
                  { icon: '💰', text: 'You earn 5% — instantly and forever' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'color-mix(in srgb, var(--neon) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--neon) 20%, transparent)' }}>{s.icon}</div>
                    <span className="text-sm sm:text-base" style={{ color: 'var(--text2)' }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>What Voters Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card card-hover p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.stars).fill(0).map((_, j) => <Star key={j} size={13} fill="#fbbf24" className="text-yellow-400" />)}
                </div>
                <p className="text-sm italic leading-relaxed mb-4" style={{ color: 'var(--text3)' }}>"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <Avatar text={t.avatar} size="sm" />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text4)' }}>Verified Voter</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>Frequently Asked</h2>
          </div>
          <div className="space-y-0">
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button className="w-full flex items-center justify-between py-4 text-left gap-4" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text)' }}>{f.q}</span>
                  <ChevronDown size={16} className="flex-shrink-0 transition-transform" style={{ color: 'var(--text4)', transform: faqOpen === i ? 'rotate(180deg)' : 'none' }} />
                </button>
                {faqOpen === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>{f.a}</motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-4" style={{ color: 'var(--text)' }}>Ready to Train AI & Earn?</h2>
          <p className="text-sm sm:text-base mb-8" style={{ color: 'var(--text3)' }}>Join 8,400+ voters already earning from AI training. Free to start.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3.5 inline-flex">
            Create Free Account <ArrowRight size={16} />
          </Link>
          <div className="text-xs mt-4" style={{ color: 'var(--text4)' }}>No credit card · Instant signup · Withdraw anytime</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-neon rounded-lg flex items-center justify-center"><Cpu size={14} className="text-black" /></div>
                <span className="font-display font-black text-lg" style={{ color: 'var(--text)' }}>Vote<span className="text-neon">AI</span></span>
              </div>
              <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: 'var(--text3)' }}>Vote on AI images. Help train artificial intelligence. Earn real money.</p>
            </div>
            {[
              { title: 'Platform', links: [{ label: 'How It Works', path: '#how-it-works' }, { label: 'Vote Rounds', path: '/rounds' }, { label: 'Leaderboard', path: '/dashboard' }, { label: 'Fairness', path: '/terms' }] },
              { title: 'Account', links: [{ label: 'Register', path: '/register' }, { label: 'Login', path: '/login' }, { label: 'Referral', path: '/referral' }, { label: 'Withdraw', path: '/withdrawal' }] },
              { title: 'Legal', links: [{ label: 'FAQ', path: '#faq' }, { label: 'Contact', path: '/terms' }, { label: 'Terms of Use', path: '/terms' }, { label: 'Privacy Policy', path: '/privacy' }] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text4)' }}>{col.title}</div>
                {col.links.map(l => (
                  <Link key={l.label} to={l.path} className="block text-sm mb-2 transition-colors hover:text-neon" style={{ color: 'var(--text3)' }}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text4)' }}>
            <span>© 2024 VoteAI. All rights reserved.</span>
            <span>🔒 Provably Fair · 256-bit SSL · Instant Payouts</span>
          </div>
        </div>
      </footer>
    </div>
  )
}