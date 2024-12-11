/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Scans all JS/TS files in the src folder
  theme: {
    extend: {
      colors: {
        primary: "#05B6D3", // Custom primary color
        secondary: "#EF863E", // Custom secondary color
      },
      backgroundImage: {
        "login-bg-image": "url('src/assets/Login.png')",
        "signup-bg-image": "url('src/assets/SignUp.png')",
      },
    },
  },
  plugins: [], // No plugins added yet
};
