/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // C'est cette ligne qui manquait !
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",    // Ton bleu nuit
        secondary: "#3b82f6",  // Ton bleu sport
        background: "#f1f5f9", // Le fond gris clair
      },
    },
  },
  plugins: [],
}