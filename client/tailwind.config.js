/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5722',
        secondary: '#2D3436',
        accent: '#FFC107',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        error: '#D32F2F',
      }
    },
  },
  plugins: [],
}
