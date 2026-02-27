/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
        "!./node_modules/**",
        "!./dist/**",
        "!./backend/**",
        "!./electron/**",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--gh-primary)",
                "gh-bg": "var(--gh-bg)",
                "gh-bg-secondary": "var(--gh-bg-secondary)",
                "gh-bg-tertiary": "var(--gh-bg-tertiary)",
                "gh-border": "var(--gh-border)",
                "gh-text": "var(--gh-text)",
                "gh-text-secondary": "var(--gh-text-secondary)",
                "vscode-editor": "#1e1e1e",
                "vscode-sidebar": "#252526",
                "vscode-border": "#333333",
                "vscode-activity-bar": "#333333",
            },
            fontFamily: {
                display: [
                    "Inter",
                    "SF Pro Display",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "sans-serif",
                ],
                mono: [
                    "JetBrains Mono",
                    "ui-monospace",
                    "SFMono-Regular",
                    "Menlo",
                    "Monaco",
                    "Consolas",
                    "monospace",
                ],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/container-queries"),
    ],
};
