/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C5E2E',
        secondary: '#F5F5DC',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      flex: {
        2: '2 2 0%', // flex-grow: 2, flex-shrink: 2, flex-basis: 0%
      },
    },
  },
  plugins: [],
};
