const baseConfig = require("@cameroon-merchants/ui/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/templates/src/**/*.{js,ts,jsx,tsx}",
  ],
};
