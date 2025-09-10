import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1700px",
      },
    },
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent": "var(--gradient-accent)",
        "gradient-glow": "var(--gradient-glow)",

        "dots-gradient": `
    radial-gradient(circle, rgba(232, 232, 232, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, #000000, #150724)
  `,
      },
      backgroundSize: {
        dots: "30px 30px, 100% 100%",
      },

      backdropBlur: {
        glass: "10px",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        glow: "var(--shadow-glow)",
        intense: "var(--shadow-intense)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fire-pop": {
          "0%, 100%": { filter: "drop-shadow(0 0 10px #A66EFF88)" },
          "20%": { filter: "drop-shadow(0 0 18px #A66EFFBB)" },
          "40%": { filter: "drop-shadow(0 0 14px #A66EFF55)" },
          "60%": { filter: "drop-shadow(0 0 22px #A66EFFCC)" },
          "80%": { filter: "drop-shadow(0 0 16px #A66EFFBB)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        runner: {
          "0%": {
            top: "-2px",
            left: "0%",
            width: "20px",
            height: "2px",
            transform: "rotate(0deg)",
          },

          "25%": {
            top: "-2px",
            left: "100%",
            width: "20px",
            height: "2px",
            transform: "translateX(-100%) rotate(0deg)",
          },

          "50%": {
            top: "-2px",
            left: "100%",
            width: "2px",
            height: "20px",
            transform: "translateY(0) rotate(0deg)",
          },

          "75%": {
            top: "100%",
            left: "100%",
            width: "20px",
            height: "2px",
            transform: "translate(-100%,-100%) rotate(0deg)",
          },

          "85%": {
            top: "100%",
            left: "0%",
            width: "1px",
            height: "20px",
            transform: "translateY(-100%) rotate(0deg)",
          },

          "100%": {
            top: "-2px",
            left: "0%",
            width: "20px",
            height: "2px",
            transform: "rotate(0deg)",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "fire-pop": "fire-pop 0.4s ease",
        "fire-flicker": "fire-flicker 0.7s infinite alternate",
        "spin-slow": "spinSlow 4s linear infinite",
        runner: "runner 4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
} satisfies Config;
