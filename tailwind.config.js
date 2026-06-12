/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#f7f1e8",
        milk: "#fffaf2",
        linen: "#e9ddca",
        stone: "#83796b",
        olive: "#59624a",
        rosewood: "#7c4f45",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(18, 16, 13, 0.08)",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        reveal: "reveal 800ms ease both",
        floatSoft: "floatSoft 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
