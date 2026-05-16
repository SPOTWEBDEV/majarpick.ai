import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { useStore } from './store/useStore.js'
import { authApi, tokenStore } from './services/api.js'
import './index.css'

// Apply initial theme before first render
const { darkMode } = useStore.getState()
document.documentElement.classList.toggle('dark', darkMode)
document.documentElement.classList.toggle('light', !darkMode)

// Restore user session if token exists
async function bootstrap() {
  const token = tokenStore.get()
  if (token) {
    try {
      const res = await authApi.me()
      if (res?.data) useStore.getState().restoreSession(res.data)
    } catch {
      tokenStore.remove() // token expired / invalid
    }
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
}

bootstrap()
