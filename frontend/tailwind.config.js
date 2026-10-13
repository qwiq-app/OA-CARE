module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#11A9E2",
          dark: "#0B92D1",
          light: "#3DBFEE",
        },
        "bg-main": "#F4FAFD",
        "bg-section": "#EAF6FB",
        "text-main": "#1E1E1E",
        "text-body": "#2A2A2A",
        "text-muted": "#8D98A5",
        white: "#FFFFFF",
      },
      fontFamily: {
        body: ["Poppins", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "26px",
        "hero-shape": "180px 40px 40px 180px",
        xl2: "34px",
      },
      boxShadow: {
        card: "0 12px 30px rgba(17,169,226,0.12)",
        float: "0 8px 20px rgba(17,169,226,0.18)",
        white: "0 15px 35px rgba(0,0,0,0.08)",
        btn: "0 10px 25px rgba(17,169,226,0.3)",
      },
    },
  },
  plugins: [],
};
