/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede5',
          200: '#c5dcce',
          300: '#9bc2ad',
          400: '#6ea388',
          500: '#4e866b',
          600: '#3c6c55',
          700: '#315645',
          800: '#294538',
          900: '#1d3128',
          950: '#0e1b15',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e9ece3',
          200: '#d5dbc9',
          300: '#b8c3a5',
          400: '#9caa82',
          500: '#819166',
          600: '#64724e',
          700: '#4e593e',
          800: '#404934',
          900: '#373e2e',
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
