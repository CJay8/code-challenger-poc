/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        terminal: {
          dark: '#0a0a0f',
          darker: '#050508',
          light: '#1a1a24',
          lighter: '#252532',
        },
        // Cyberpunk accent colors
        cyber: {
          cyan: {
            DEFAULT: '#00f0ff',
            dark: '#00b8cc',
            light: '#5ff4ff',
            glow: 'rgba(0, 240, 255, 0.5)',
          },
          magenta: {
            DEFAULT: '#ff00aa',
            dark: '#cc0088',
            light: '#ff5fc8',
            glow: 'rgba(255, 0, 170, 0.5)',
          },
          green: {
            DEFAULT: '#00ff9d',
            dark: '#00cc7d',
            light: '#5fffb8',
            glow: 'rgba(0, 255, 157, 0.5)',
          },
          purple: {
            DEFAULT: '#8a2be2',
            dark: '#6b22b3',
            light: '#a855f7',
            glow: 'rgba(138, 43, 226, 0.5)',
          },
          yellow: {
            DEFAULT: '#ffff00',
            dark: '#cccc00',
            light: '#ffff5f',
            glow: 'rgba(255, 255, 0, 0.5)',
          },
          red: {
            DEFAULT: '#ff0055',
            dark: '#cc0044',
            light: '#ff5588',
            glow: 'rgba(255, 0, 85, 0.5)',
          },
        },
        // Grayscale with terminal feel
        'terminal-gray': {
          50: '#f8f8fa',
          100: '#e8e8eb',
          200: '#d1d1d7',
          300: '#b0b0bb',
          400: '#8a8a99',
          500: '#6b6b7c',
          600: '#545463',
          700: '#454552',
          800: '#3a3a45',
          900: '#2a2a35',
          950: '#1a1a24',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        code: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow-fast': 'pulse-glow 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'terminal-blink': 'terminal-blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 2px currentColor) drop-shadow(0 0 8px currentColor)',
          },
          '50%': {
            opacity: '0.8',
            filter: 'drop-shadow(0 0 4px currentColor) drop-shadow(0 0 12px currentColor)',
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'terminal-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'glow': {
          'from': {
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          'to': {
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'glow-magenta': '0 0 20px rgba(255, 0, 170, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 157, 0.5)',
        'glow-purple': '0 0 20px rgba(138, 43, 226, 0.5)',
        'glow-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.3)',
        'glow-magenta-lg': '0 0 30px rgba(255, 0, 170, 0.6), 0 0 60px rgba(255, 0, 170, 0.3)',
        'terminal': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'terminal-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bg-clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
