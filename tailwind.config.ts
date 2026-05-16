import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette
        primary: {
          DEFAULT: '#0F2040',
          light: '#1A3A6B',
          50: '#EEF2F8',
          100: '#D4DFEE',
          200: '#A9BFDC',
          300: '#7E9FC9',
          400: '#537FB7',
          500: '#2D7DD2',
          600: '#2566AE',
          700: '#1D4F89',
          800: '#1A3A6B',
          900: '#0F2040',
        },
        // Accent
        accent: {
          DEFAULT: '#2D7DD2',
          warm: '#F4A261',
          50: '#EBF4FC',
          100: '#CCE3F7',
          200: '#99C7EF',
          300: '#66ABE7',
          400: '#338FDF',
          500: '#2D7DD2',
          600: '#2466AE',
          700: '#1B4E8A',
          800: '#123766',
          900: '#091F42',
        },
        // Warm CTA
        warm: {
          DEFAULT: '#F4A261',
          50: '#FEF3EA',
          100: '#FDE3C9',
          200: '#FBC793',
          300: '#F9AB5D',
          400: '#F4A261',
          500: '#F08030',
          600: '#D96818',
          700: '#A84E10',
          800: '#773508',
          900: '#461C00',
        },
        // AI purple
        ai: {
          DEFAULT: '#7C3AED',
          50: '#F5F0FD',
          100: '#EAE0FA',
          200: '#D5C0F5',
          300: '#BFA0F0',
          400: '#AA80EB',
          500: '#7C3AED',
          600: '#6520D4',
          700: '#4D18A2',
          800: '#361070',
          900: '#1F083E',
        },
        // Surface
        surface: {
          DEFAULT: '#FAFBFC',
          2: '#F0F4F8',
          3: '#E4EBF2',
          dark: '#0D1117',
          'dark-2': '#161B22',
          'dark-3': '#21262D',
        },
        // Border
        border: {
          DEFAULT: '#D1DCE8',
          dark: '#30363D',
        },
        // Semantic
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        cv: ['Georgia', 'Times New Roman', 'serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'slide-left': 'slideLeft 0.35s ease-out forwards',
        'slide-right': 'slideRight 0.35s ease-out forwards',
        shake: 'shake 0.4s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'typing': 'typing 1.5s steps(20) infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 125, 210, 0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(45, 125, 210, 0.15)' },
        },
        typing: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.06)' },
          '70%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)',
        'button': '0 1px 3px rgba(15,32,64,0.15), 0 4px 12px rgba(15,32,64,0.1)',
        'button-hover': '0 4px 16px rgba(15,32,64,0.2), 0 8px 32px rgba(15,32,64,0.12)',
        'input-focus': '0 0 0 3px rgba(45, 125, 210, 0.15)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        'ai': '0 0 0 3px rgba(124, 58, 237, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
