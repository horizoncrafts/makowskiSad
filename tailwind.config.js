/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': '#2C5E2E',
        'secondary': '#F5F5DC',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
    }
  },
  plugins: [],
} 