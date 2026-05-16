import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Toasts from './components/Toasts'

// ── Public pages ──────────────────────────────────────────────
import Landing from './pages/Landing'
import { Login, Register } from './pages/Auth'
import AddAccount from './pages/AddAccount'

// ── User dashboard pages ──────────────────────────────────────
import Dashboard from './pages/Dashboard'
import Deposit from './pages/Deposit'
import {
  Withdrawal,
  Referral,
  Settings,
  Rounds,
  History,
  Notifications,
} from './pages/UserPages'

// ── Admin pages ───────────────────────────────────────────────
import {
  AdminLogin,
  AdminDashboard,
  AdminUsers,
  AdminRounds,
  AdminCreateRound,
  AdminResults,
  AdminDeposits,
  AdminWithdrawals,
  AdminSettings,
} from './pages/admin/AdminPages'

// ── 404 ───────────────────────────────────────────────────────
import NotFound from './pages/NotFound'

// ── Route guards ──────────────────────────────────────────────
function PrivateRoute({ children }) {
  const isLoggedIn = useStore(s => s.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const isAdminLoggedIn = useStore(s => s.isAdminLoggedIn)
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" replace />
}

function GuestRoute({ children }) {
  const isLoggedIn = useStore(s => s.isLoggedIn)
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />
}

// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Global toast notifications */}
      <Toasts />

      <Routes>
        {/* ── Public / Landing ──────────────────────────────── */}
        <Route path="/" element={<Landing />} />

        {/* ── Auth (guest only) ─────────────────────────────── */}
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />

        {/* ── Add Account (after register, before dashboard) ── */}
        <Route path="/add-account" element={<AddAccount />} />

        {/* ── Protected user dashboard routes ───────────────── */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/deposit" element={
          <PrivateRoute><Deposit /></PrivateRoute>
        } />
        <Route path="/withdrawal" element={
          <PrivateRoute><Withdrawal /></PrivateRoute>
        } />
        <Route path="/referral" element={
          <PrivateRoute><Referral /></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />
        <Route path="/rounds" element={
          <PrivateRoute><Rounds /></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><History /></PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute><Notifications /></PrivateRoute>
        } />

        {/* ── Admin routes ──────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminUsers /></AdminRoute>
        } />
        <Route path="/admin/rounds" element={
          <AdminRoute><AdminRounds /></AdminRoute>
        } />
        <Route path="/admin/create-round" element={
          <AdminRoute><AdminCreateRound /></AdminRoute>
        } />
        <Route path="/admin/results" element={
          <AdminRoute><AdminResults /></AdminRoute>
        } />
        <Route path="/admin/deposits" element={
          <AdminRoute><AdminDeposits /></AdminRoute>
        } />
        <Route path="/admin/withdrawals" element={
          <AdminRoute><AdminWithdrawals /></AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute><AdminSettings /></AdminRoute>
        } />

        {/* ── Redirect /admin → /admin/login ────────────────── */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

        {/* ── 404 fallback ──────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
