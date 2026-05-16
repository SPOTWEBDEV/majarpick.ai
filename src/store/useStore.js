// src/store/useStore.js
import { create } from 'zustand'
import { tokenStore } from '../services/api'

export const useStore = create((set, get) => ({
  // ── Auth ───────────────────────────────────────────────────
  user: null,
  adminUser: null,
  isLoggedIn: false,
  isAdminLoggedIn: false,



  // Called after successful API login — stores user + token
  loginSuccess: (userData, token) => {
    console.log('Storing user data and token in store:', userData, token)
    tokenStore.set(token)
    set({ user: userData, isLoggedIn: true })
    console.log("isLoggedIn:", get().isLoggedIn) // true
  },
  adminLoginSuccess: (adminData, token) => {
    tokenStore.setAdmin(token)
    set({ adminUser: adminData, isAdminLoggedIn: true })
  },
  // Update user data in store (e.g. after profile update / balance change)
  setUser: (userData) => set({ user: userData }),

  logout: () => {
    tokenStore.remove()
    set({ user: null, isLoggedIn: false })
  },
  adminLogout: () => {
    tokenStore.removeAdmin()
    set({ adminUser: null, isAdminLoggedIn: false })
  },

  // Restore session from stored token on app boot
  restoreSession: (userData) => set({ user: userData }),
  restoreAdminSession: (adminData) => set({ adminUser: adminData }),

  // ── Theme ──────────────────────────────────────────────────
  darkMode: true,
  initTheme: () => {
    const dark = get().darkMode
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('light', !dark)
  },
  toggleTheme: () => {
    const next = !get().darkMode
    set({ darkMode: next })
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.classList.toggle('light', !next)
  },

  // ── Toasts ─────────────────────────────────────────────────
  toasts: [],
  addToast: (msg, type = 'success') => {
    const id = Date.now()
    set(s => ({ toasts: [...s.toasts, { id, msg, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3500)
  },

  // ── Current game round (UI state only) ─────────────────────
  // Populated by Dashboard when it fetches /rounds/live
  currentRound: {
    id: null, countdown: 0, selectedImage: null,
    locked: false, result: null, phase: 'select',
    images: [], prize_pool: 0, total_voters: 0,
  },
  setCurrentRound: (roundData) => set({ currentRound: { ...roundData, phase: 'select', selectedImage: null, locked: false, result: null } }),
  selectImage: (imageId) => {
    set(s => ({ currentRound: { ...s.currentRound, selectedImage: imageId, locked: true } }))
    get().addToast('Vote locked in! Waiting for result...', 'success')
  },
  setResult: (winnerImageId) => set(s => ({ currentRound: { ...s.currentRound, result: winnerImageId, phase: 'result' } })),
  resetRound: (newRound) => {
    if (newRound) {
      set({ currentRound: { ...newRound, phase: 'select', selectedImage: null, locked: false, result: null } })
    } else {
      set(s => ({ currentRound: { ...s.currentRound, phase: 'select', selectedImage: null, locked: false, result: null } }))
    }
  },
  tickCountdown: () => set(s => ({
    currentRound: { ...s.currentRound, countdown: Math.max(0, s.currentRound.countdown - 1) }
  })),

  // ── UI ─────────────────────────────────────────────────────
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}))
