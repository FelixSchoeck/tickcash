import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // wichtig für Darkmode per Klasse
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}", // falls du src/ nutzt
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;