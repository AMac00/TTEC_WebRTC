/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
        colors: {
            'blue': '#049fd9',
            'gray-dark': '#292929',
            'gray': '#6a6b6c',
            'gray-light': '#bdc3c7',
            'green': '#2CB14C',
            'white': '#ffffff',
            'red': '#d4371c',
            'black': '#000000'
        },
    },
    
    plugins: [],
}
