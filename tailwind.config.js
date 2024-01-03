/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
  },
  daisyui: {
    // themes: [
    //   {
    //     light: {
    //       ...require("daisyui/src/theming/themes")["light"],
    //       "background-color": "rgba(249,250,251)",
    //       ".input-light": {
    //         "background-color": "#fff",
    //         "border-color": "#7a7a7a",
    //       },
    //       ".input-light:hover": {
    //         "background-color": "#fff",
    //         "border-color": "#9a9a9a",
    //       },
    //       ".input-light:focus": {
    //         "border-color": "#166583",
    //       },
    //       color: "#000",
    //     },
    //     dark: {
    //       ...require("daisyui/src/theming/themes")["dark"],

    //       ".input-dark": {
    //         "background-color": "rgba(17 ,24 ,39)",
    //         "border-color": "#7a7a7a",
    //         "text-color": "#fff",
    //       },
    //       ".input-dark:hover": {
    //         "border-color": "#fff",
    //       },
    //       ".input-dark:focus": {
    //         "border-color": "#fff",
    //         "background-color": "rgba(17 ,24 ,39)",
    //       },
    //       "background-color": "rgba(17 ,24 ,39)",
    //       'text-color': "#ddd",
    //     },
    //   },
    // ],
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],
};

