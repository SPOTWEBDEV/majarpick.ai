/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        neon: '#00ff9d',
        'neon-dim': 'rgba(0,255,157,0.15)',
        dark: {
          DEFAULT: '#050508',
          2: '#0c0c14',
          3: '#12121e',
          4: '#1a1a2e',
        },
        card: {
          DEFAULT: '#111120',
          2: '#181830',
        }
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ticker':     'ticker 25s linear infinite',
        'fade-in':    'fadeInUp 0.4s ease both',
        'pop-in':     'popIn 0.3s ease both',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        pulseGlow:  { '0%,100%': { boxShadow: '0 0 20px rgba(0,255,157,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(0,255,157,0.5)' } },
        ticker:     { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeInUp:   { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        popIn:      { '0%': { transform: 'scale(0.85)', opacity: '0' }, '80%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    }
  },
  plugins: []
}
