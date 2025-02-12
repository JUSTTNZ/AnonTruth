/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    theme: {
      extend: {
        fontFamily: {
        sans: ["Montserrat", "sans-serif"], 
        },
        colors: {
        deepBlue: "#003366", 
        electricTeal: "#00CCFF", 
      },
      },  
    },
    plugins: [],
  }