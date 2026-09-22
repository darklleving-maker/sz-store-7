/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sz7: {
          red: "#E63946",
          dark: "#0a0a0a",
          card: "#1a1a1a",
          gold: "#D4AF37",
        },
      },
    },
  },
  plugins: [],
};
