/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: '#080810',
        'background-surface': '#0D0D18',
        'background-card': '#13131F',
        
        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#8888A8',
        'text-tertiary': '#6B6B7F',
        
        // Border colors
        'border-primary': '#1E1E30',
        'border-secondary': '#2A2A3E',
        
        // Accent colors
        'accent-indigo': '#6366F1',
        'accent-indigo-dark': '#4F46E5',
        'accent-gold': '#F5C518',
        'accent-green': '#22C55E',
        'accent-red': '#EF4444',
        
        // Semantic colors
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F5C518',
        info: '#6366F1',
      },
      fontSize: {
        // Display sizes
        'display-lg': ['36px', { fontWeight: '900', letterSpacing: '-1px', lineHeight: '1' }],
        'display-md': ['28px', { fontWeight: '900', letterSpacing: '-0.5px', lineHeight: '1' }],
        
        // Heading sizes
        'heading-lg': ['20px', { fontWeight: '700', lineHeight: '1.2' }],
        'heading-md': ['16px', { fontWeight: '700', lineHeight: '1.3' }],
        
        // Body sizes
        'body-lg': ['16px', { fontWeight: '400', lineHeight: '1.6' }],
        'body-md': ['13px', { fontWeight: '500', lineHeight: '1.5' }],
        'body-sm': ['12px', { fontWeight: '400', lineHeight: '1.5' }],
        
        // Meta sizes
        'meta': ['11px', { fontWeight: '400', color: '#8888A8', lineHeight: '1.4' }],
        'meta-bold': ['11px', { fontWeight: '600', color: '#8888A8', lineHeight: '1.4' }],
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
      backdropBlur: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
      },
      boxShadow: {
        // Component shadows
        'card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.5)',
        
        // Accent shadows
        'accent-indigo': '0 0 24px rgba(99, 102, 241, 0.3)',
        'accent-gold': '0 0 24px rgba(245, 197, 24, 0.3)',
        'accent-green': '0 0 24px rgba(34, 197, 94, 0.3)',
        'accent-red': '0 0 24px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'gradient-slow': 'gradient-shift 8s ease infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      aspectRatio: {
        'poster': '2 / 3',
        'banner': '16 / 9',
        'square': '1 / 1',
      },
      spacing: {
        'safe-x': 'max(1rem, env(safe-area-inset-left), env(safe-area-inset-right))',
        'safe-y': 'max(1rem, env(safe-area-inset-top), env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
}
