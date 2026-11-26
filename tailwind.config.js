/** @type {import('tailwindcss').Config} */
export default {
    // Only top-level and first-level folders are scanned. Recursive globs would also
    // read components/resume-analyzer/node_modules, which slows the build.
    content: ["./index.html", "./*.{js,jsx}", "./components/*.{js,jsx}", "./hooks/*.{js,jsx}", "./lib/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                canvas: "rgb(var(--canvas) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",
                primary: "rgb(var(--primary) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                "on-accent": "rgb(var(--on-accent) / <alpha-value>)",
                line: "rgb(var(--line) / <alpha-value>)",
                danger: "rgb(var(--danger) / <alpha-value>)",
            },
        },
    },
    plugins: [],
};
