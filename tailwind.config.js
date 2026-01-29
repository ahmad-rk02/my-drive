/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',           // important: enables dark: prefix
    theme: {
        extend: {
            colors: {
                primary: '#1a73e8',    // Google blue
                secondary: '#f1f3f4',
                darkBg: '#202124',
                darkCard: '#3c4043',
            },
        },
    },
    plugins: [],
}