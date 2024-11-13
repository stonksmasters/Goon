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
      },
    },
  },
  plugins: [],
};
