export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "chat-background": "url('/chat-bg.png')",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        link: "hsl(var(--link))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        dropdown: {
          DEFAULT: "hsl(var(--dropdown))",
          foreground: "hsl(var(--dropdown-foreground))",
        },
      },
      gridTemplateColumns: {
        main: "auto 1fr",
      },
      fontSize: {
        clamp2Xs: "clamp(0.65rem, 0.85vw, 0.8rem)",
        clampXs: "clamp(0.75rem, 0.9vw, 0.85rem)",
        clampSm: "clamp(0.85rem, 1vw, 1rem)",
        clampMd: "clamp(1rem, 1.2vw, 1.2rem)",
        clampBase: "clamp(1.2rem, 1.5vw, 1.5rem)",
        clampLg: "clamp(1.4rem, 2vw, 2rem)",
        clampXl: "clamp(1.55rem, 2.5vw, 2.5rem)",
        clamp2Xl: "clamp(1.8rem, 3vw, 3rem)",
        clamp3Xl: "clamp(2rem, 3.5vw, 3.5rem)",
      },
      screens: {
        // min-width
        xs: { min: "460px" },
        sm: { min: "567px" },
        md: { min: "767px" },
        lg: { min: "992px" },
        xl: { min: "1200px" },
        "2xl": { min: "1600px" },

        // max-width breakpoints
        "max-xs": { max: "460px" },
        "max-sm": { max: "567px" },
        "max-md": { max: "767px" },
        "max-lg": { max: "992px" },
        "max-xl": { max: "1200px" },
        "max-2xl": { max: "1600px" },
      },
    },
  },
  plugins: [],
};

// "teal-light": "#7ae3c3",
// "photopicker-overlay-background": "rgba(30,42,49,0.8)",
// "dropdown-background": "-->dropdown",
// "dropdown-background-hover": "-->dropdown",
// "input-background": "-->input",
// "primary-strong": "",
// "panel-header-background": "-->background",
// "background-default-hover": "-->background",
// "incoming-background": "-->background",
// "panel-header-icon": "-->link",
// "icon-lighter": "-->secondary",
// "icon-green": "#00a884",
// "search-input-container-background": "-->primary/50",
// "outgoing-background": "#005c4b",
// "bubble-meta": "hsla(0,0%,100%,0.6)",
// "icon-ack": "#53bdeb",
