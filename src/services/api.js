// src/services/api.js
// All API calls go through this file.
// Pages import what they need — no fetch() scattered around components.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ── Token storage ──────────────────────────────────────────────
export const tokenStore = {
  get: ()        => localStorage.getItem('voteai_token'),
  set: (t)       => localStorage.setItem('voteai_token', t),
  remove: ()     => localStorage.removeItem('voteai_token'),
  getAdmin: ()   => localStorage.getItem('voteai_admin_token'),
  setAdmin: (t)  => localStorage.setItem('voteai_admin_token', t),
  removeAdmin: () => localStorage.removeItem('voteai_admin_token'),
}

// ── Core fetch wrapper ────────────────────────────────────────
async function request(path, options = {}, useAdminToken = false) {
  const token = useAdminToken ? tokenStore.getAdmin() : tokenStore.get()

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('Invalid JSON response from server')
  }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`)
    err.status  = res.status
    err.errors  = data?.errors
    err.data    = data
    throw err
  }

  return data
}

const get    = (path, admin) => request(path, { method: 'GET' }, admin)
const post   = (path, body, admin) => request(path, { method: 'POST',   body: JSON.stringify(body) }, admin)
const put    = (path, body, admin) => request(path, { method: 'PUT',    body: JSON.stringify(body) }, admin)
const del    = (path, admin)       => request(path, { method: 'DELETE' }, admin)

// ── AUTH ───────────────────────────────────────────────────────
export const authApi = {
  register: (data)  => post('/auth/register', data),
  login:    (data)  => post('/auth/login', data),
  me:       ()      => get('/auth/me'),
  updateProfile:     (data) => put('/auth/profile', data),
  changePassword:    (data) => put('/auth/change-password', data),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('avatar', file)
    const token = tokenStore.get()
    return fetch(`${BASE_URL}/user/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(r => r.json())
  },
  // Admin
  adminLogin: (data) => post('/auth/admin/login', data),
}

// ── ROUNDS ────────────────────────────────────────────────────
export const roundsApi = {
  list:           (params = {}) => get('/rounds?' + new URLSearchParams(params).toString()),
  live:           ()            => get('/rounds/live'),
  show:           (id)          => get(`/rounds/${id}`),
  vote:           (id, imageId) => post(`/rounds/${id}/vote`, { image_id: imageId }),
  results:        (id)          => get(`/rounds/${id}/results`),
  leaderboard:    ()            => get('/rounds/leaderboard'),
  recentWinners:  ()            => get('/rounds/recent-winners'),
}

// ── TRANSACTIONS ──────────────────────────────────────────────
export const transactionsApi = {
  list:            (params = {}) => get('/transactions?' + new URLSearchParams(params).toString()),
  show:            (id)          => get(`/transactions/${id}`),
  createDeposit:   (data)        => post('/transactions/deposit', data),
  createWithdrawal:(data)        => post('/transactions/withdrawal', data),
}

// ── WITHDRAWAL ACCOUNTS ───────────────────────────────────────
export const accountsApi = {
  list:       ()     => get('/accounts'),
  create:     (data) => post('/accounts', data),
  remove:     (id)   => del(`/accounts/${id}`),
  setDefault: (id)   => put(`/accounts/${id}/default`, {}),
}

// ── REFERRALS ─────────────────────────────────────────────────
export const referralsApi = {
  get: () => get('/referrals'),
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const notificationsApi = {
  list:       (params = {}) => get('/notifications?' + new URLSearchParams(params).toString()),
  markAllRead:()            => put('/notifications/read-all', {}),
  markRead:   (id)          => put(`/notifications/${id}/read`, {}),
}

// ── SETTINGS ──────────────────────────────────────────────────
export const settingsApi = {
  depositInfo: () => get('/settings/deposit-info'),
}

// ── ADMIN ─────────────────────────────────────────────────────
const adm = (path, opts) => request(path, opts, true)
const admGet  = (path)       => adm(path, { method: 'GET' })
const admPost = (path, body) => adm(path, { method: 'POST',   body: JSON.stringify(body) })
const admPut  = (path, body) => adm(path, { method: 'PUT',    body: JSON.stringify(body) })

export const adminApi = {
  dashboard:   ()           => admGet('/admin/dashboard'),

  // Users
  users:           (params = {}) => admGet('/admin/users?' + new URLSearchParams(params).toString()),
  showUser:        (id)          => admGet(`/admin/users/${id}`),
  updateUserStatus:(id, status)  => admPut(`/admin/users/${id}/status`, { status }),
  adjustBalance:   (id, amount, reason) => admPut(`/admin/users/${id}/balance`, { amount, reason }),

  // Rounds
  rounds:          (params = {}) => admGet('/admin/rounds?' + new URLSearchParams(params).toString()),
  createRound:     (data)        => admPost('/admin/rounds', data),
  updateRoundStatus:(id, status) => admPut(`/admin/rounds/${id}/status`, { status }),
  publishResult:   (id, winnerImageId) => admPost(`/admin/rounds/${id}/publish-result`, { winner_image_id: winnerImageId }),

  // Deposits
  deposits:        (params = {}) => admGet('/admin/deposits?' + new URLSearchParams(params).toString()),
  approveDeposit:  (id)          => admPut(`/admin/deposits/${id}/approve`, {}),
  rejectDeposit:   (id, reason)  => admPut(`/admin/deposits/${id}/reject`, { reason }),

  // Withdrawals
  withdrawals:     (params = {}) => admGet('/admin/withdrawals?' + new URLSearchParams(params).toString()),
  approveWithdrawal:(id)         => admPut(`/admin/withdrawals/${id}/approve`, {}),
  rejectWithdrawal: (id, reason) => admPut(`/admin/withdrawals/${id}/reject`, { reason }),

  // Settings
  getSettings:  ()     => admGet('/admin/settings'),
  saveSettings: (data) => admPut('/admin/settings', data),

  // Image upload (multipart)
  uploadImage: (file) => {
    const form = new FormData()
    form.append('image', file)
    const token = tokenStore.getAdmin()
    return fetch(`${BASE_URL}/admin/upload-image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(r => r.json())
  },
}
