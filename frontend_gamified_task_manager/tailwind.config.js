/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Theme tokens from work item style guide
        primary: "#3B82F6",
        secondary: "#10B981",
        success: "#F59E0B",
        error: "#EF4444",
        appbg: "#f9fafb",
        surface: "#ffffff",
        apptext: "#111827"
      }
    }
  },
  plugins: []
};
