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
        slate: {
          900: '#1e293b',
          800: '#334155',
          700: '#475569',
          600: '#475569', // text-slate-grey
        },
      }
    },
  },
  plugins: [],
}
