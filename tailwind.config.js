/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#3B82F6",
        accent: "#93C5FD",
        background: "#F3F4F6",
        dark: "#1F2937",
      },
    },
  },
  plugins: [],
} 