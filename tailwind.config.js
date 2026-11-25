/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./hooks/**/*.{js,jsx}",
        "./lib/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["Newsreader", "serif"],
                body: ['"Atkinson Hyperlegible"', "sans-serif"],
            },
            colors: {
                ink: "#0D0E10",
                bone: "#ECEAE4",
                pencil: "#8F8C85",
                correction: "#FF6B57",
                sage: "#8DB89A",
            },
        },
    },
    plugins: [],
};
