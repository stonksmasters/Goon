// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'black-01': '#040404',
        'black-02': '#050505',
        'black-03': '#070707',
        'black-04': '#111111',
        'black-05': '#141414',
        'grey-01': '#282828',
        'grey-02': '#494949',
        'grey-03': '#6a6a6a',
        'grey-04': '#8b8b8b',
        'grey-05': '#acacac',
        'grey-06': '#cdcdcd',
        'grey-07': '#cfcfcf',
        'orange': '#97ff00',
        'white': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Enhanced form styles
    require('@tailwindcss/typography'), // Better typography
    require('@tailwindcss/aspect-ratio'), // Aspect ratio utilities
  ],
};
