import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { authApi , tokenStore } from '../services/api'
import { Cpu, Eye, EyeOff, User, Mail, Lock, Phone, Hash, Loader2 } from 'lucide-react'

function AuthWrap({ children }) {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(0,255,157,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 bg-neon rounded-xl flex items-center justify-center">
                <Cpu size={18} className="text-black" />
              </div>
              <span className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Vote<span className="text-neon">AI</span></span>
            </Link>
          </div>
          <div className="card p-6 sm:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { loginSuccess, addToast } = useStore()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState({ login: '', password: '' })
  const [error, setError] = useState('')

  const set = (k, v) => setFields(p => ({ ...p, [k]: v }))

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!fields.login || !fields.password) { setError('Both fields are required'); return }
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login({ login: fields.login, password: fields.password })
      loginSuccess(res.data.user, res.data.token)
      addToast('Welcome back! 👋', 'success')
      useStore.s
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthWrap>
      <h2 className="font-display font-black text-2xl mb-1" style={{ color: 'var(--text)' }}>Welcome Back</h2>
      <p className="text-sm mb-7" style={{ color: 'var(--text3)' }}>Login to start voting & earning</p>
      {error && <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Email or Username</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9" type="text" placeholder="Enter email or username"
              value={fields.login} onChange={e => set('login', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9 pr-9" type={showPass ? 'text' : 'password'} placeholder="••••••••"
              value={fields.password} onChange={e => set('password', e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text4)' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <a href="#" className="text-xs text-neon hover:underline">Forgot password?</a>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Logging in...</> : 'Login to Dashboard'}
        </button>
      </form>
      <div className="mt-5 pt-5 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text3)' }}>
        No account? <Link to="/register" className="text-neon font-semibold hover:underline">Register Free</Link>
      </div>
    </AuthWrap>
  )
}

export function Register() {
  const navigate = useNavigate()
  const { addToast } = useStore()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState({
    full_name: '', username: '', email: '', phone: '', password: '', confirm: '', referral_code: ''
  })

  const set = (k, v) => setFields(p => ({ ...p, [k]: v }))

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fields.full_name || !fields.username || !fields.email || !fields.password)
      return setError('Please fill in all required fields')
    if (fields.password.length < 8)
      return setError('Password must be at least 8 characters')
    if (fields.password !== fields.confirm)
      return setError('Passwords do not match')
    setError('')
    setLoading(true)
    try {
      const res = await authApi.register({
        full_name: fields.full_name,
        username: fields.username,
        email: fields.email,
        phone: fields.phone,
        password: fields.password,
        referral_code: fields.referral_code,
      })
      
      tokenStore.set(res.data.token) 
      addToast('Account created! Add your withdrawal account.', 'success')
      navigate('/add-account')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthWrap>
      <h2 className="font-display font-black text-2xl mb-1" style={{ color: 'var(--text)' }}>Create Account</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>Join 8,400+ voters earning with AI</p>
      {error && <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg text-sm text-red-400">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Full Name</label>
            <input className="input" placeholder="John Doe" value={fields.full_name} onChange={e => set('full_name', e.target.value)} />
          </div>
          <div>
            <label className="label">Username</label>
            <input className="input" placeholder="johndoe" value={fields.username} onChange={e => set('username', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9" type="email" placeholder="john@example.com" value={fields.email} onChange={e => set('email', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Phone Number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9" type="tel" placeholder="+1 555 000 0000" value={fields.phone} onChange={e => set('phone', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9 pr-9" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
              value={fields.password} onChange={e => set('password', e.target.value)} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text4)' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9" type="password" placeholder="Repeat password"
              value={fields.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Referral Code <span className="normal-case tracking-normal font-normal" style={{ color: 'var(--text4)' }}>(optional)</span></label>
          <div className="relative">
            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text4)' }} />
            <input className="input pl-9" placeholder="e.g. ALEX2024" value={fields.referral_code} onChange={e => set('referral_code', e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
        </button>
      </form>
      <div className="mt-5 pt-5 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text3)' }}>
        Have an account? <Link to="/login" className="text-neon font-semibold hover:underline">Login</Link>
      </div>
    </AuthWrap>
  )
}
