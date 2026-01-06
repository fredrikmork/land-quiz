/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Electric Blues gradient colors
        'electric-blue-1': '#7b84ff',
        'electric-blue-2': '#68a5ff',
        'electric-blue-3': '#5fc6ff',
        'electric-blue-4': '#63e5fc',
      },
      backgroundImage: {
        // Electric Blues gradient for ALL themes
        'electric': 'linear-gradient(135deg, #7b84ff 0%, #68a5ff 33%, #5fc6ff 66%, #63e5fc 100%)',
        // Theme-specific gradients (via CSS variables)
        'gradient-main': 'var(--gradient-main)',
        'gradient-button': 'var(--gradient-button)',
        'gradient-card-1': 'var(--gradient-card-1)',
        'gradient-card-2': 'var(--gradient-card-2)',
        'gradient-card-3': 'var(--gradient-card-3)',
        'gradient-card-4': 'var(--gradient-card-4)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow': '0 0 40px var(--glow-color)',
        'glow-sm': '0 0 20px var(--glow-color)',
        'glow-card-1': '0 8px 32px var(--glow-card-1), 0 0 20px var(--glow-card-1)',
        'glow-card-2': '0 8px 32px var(--glow-card-2), 0 0 20px var(--glow-card-2)',
        'glow-card-3': '0 8px 32px var(--glow-card-3), 0 0 20px var(--glow-card-3)',
        'glow-card-4': '0 8px 32px var(--glow-card-4), 0 0 20px var(--glow-card-4)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

