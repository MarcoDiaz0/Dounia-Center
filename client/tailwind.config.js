/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f7f1',
          100: '#e4ede0',
          200: '#c9dcc2',
          300: '#a5c498',
          400: '#7fa96e',
          500: '#5F8D4E',
          600: '#4a7240',
          700: '#3b5a34',
          800: '#32492d',
          900: '#2a3d27',
          950: '#142013',
        },
        secondary: {
          50: '#faf9f6',
          100: '#f5f2ec',
          200: '#EDE6DB',
          300: '#e0d5c5',
          400: '#cdbea6',
          500: '#baa68a',
          600: '#a89072',
          700: '#8c765e',
          800: '#736150',
          900: '#5f5143',
          950: '#322a22',
        },
        sand: '#EDE6DB',
        cream: '#FAF8F5',
        forest: '#5F8D4E',
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
        latin: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(95, 141, 78, 0.1)',
        'hover': '0 10px 40px -10px rgba(95, 141, 78, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
