/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        primary: "#06b6d4", // cyan-500
        secondary: "#3b82f6", // blue-500
      },
      boxShadow: {
        cyan: "0 0 0 1px rgba(6,182,212,0.2)",
      },
    },
  },
  plugins: [],
};
