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
          50: '#f9f8fc',
          100: '#f7c2ca',
          200: '#f6a5c0',
          300: '#cc8db3',
          400: '#9d85b6',
          500: '#837ab6',
          600: '#6e64a1',
          700: '#5a508b',
          800: '#453c71',
          900: '#250e2c',
          950: '#19081e',
        },
        secondary: {
          50: '#faf6f7',
          100: '#fbf0f2',
          200: '#f7c2ca',
          300: '#eccbd2',
          400: '#cc8db3',
          500: '#9d85b6',
          600: '#837ab6',
          700: '#685a97',
          800: '#4d4077',
          900: '#3b2c60',
          950: '#250e2c',
        },
        sand: '#f7c2ca',
        cream: '#faf6f8',
        forest: '#837ab6',
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
        'card': '0 4px 20px -2px rgba(131, 122, 182, 0.1)',
        'hover': '0 10px 40px -10px rgba(131, 122, 182, 0.2)',
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
