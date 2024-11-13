// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        goonsGreen: '#38A169',
        goonsBlue: '#3182CE',
        goonsRed: '#E53E3E',
        goonsYellow: '#D69E2E', // Additional custom color
        goonsGray: '#4A5568', // For secondary elements
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
