/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b90014',
          container: '#E31B23',
          light: '#ffdad6',
          dark: '#93000d',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          lowest: '#FFFFFF',
          low: '#F3F4F5',
          container: '#EDEEEF',
          high: '#E7E8E9',
          highest: '#E1E3E4',
          dim: '#D9DADB',
        },
        onSurface: '#191c1d',
        onSurfaceVariant: '#5d3f3c',
        outline: '#926e6b',
        outlineVariant: '#e7bdb8',
        secondary: '#5f5e5e',
        tertiary: '#005f93',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 8px 32px -4px rgba(0,0,0,0.06)',
        card: '0 4px 16px -2px rgba(0,0,0,0.06)',
        float: '0 16px 64px -8px rgba(0,0,0,0.08)',
        red: '0 8px 32px -4px rgba(227,27,35,0.25)',
      },
      backdropBlur: {
        nav: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
