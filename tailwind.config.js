// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        goonsGreen: '#38A169',    // Custom green color
        goonsBlue: '#3182CE',     // Custom blue color
        goonsRed: '#E53E3E',      // Custom red color
      },
      // Add any other customizations here
    },
  },
  plugins: [],
};
