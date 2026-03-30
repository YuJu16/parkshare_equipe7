/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        sidebar: '#0F172A',
        score: {
          good: '#22c55e', // vert (>80)
          average: '#f97316', // orange (50-80)
          bad: '#ef4444', // rouge (<50)
        }
      }
    },
  },
  plugins: [],
}
