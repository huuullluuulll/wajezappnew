/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      colors: {
        neon: '#C5FF3F',
        dark: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1A1A1A',
          950: '#0a0a0a',
        },
      },
      boxShadow: {
        'neon': '0 4px 20px rgba(197, 255, 63, 0.15)',
        'neon-lg': '0 8px 30px rgba(197, 255, 63, 0.2)',
      },
    },
  },
  plugins: []
}