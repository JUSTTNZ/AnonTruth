/** @type {import('tailwindcss').Config} */
export default  {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    theme: {
      extend: {
        fontFamily: {
        sans: ["Montserrat", "sans-serif"], 
        poppins: ["Poppins", "sans-serif"],
        },
        colors: {
        deepBlue: "#003366", 
        electricTeal: "#00CCFF", 
      },
      },  
    },
    plugins: [],
  }