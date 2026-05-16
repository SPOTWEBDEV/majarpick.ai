import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { useStore } from './store/useStore.js'
import './index.css'

// Apply initial theme class to <html> before first render
const { darkMode } = useStore.getState()
document.documentElement.classList.toggle('dark', darkMode)
document.documentElement.classList.toggle('light', !darkMode)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
