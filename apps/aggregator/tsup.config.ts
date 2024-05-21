import { defineConfig } from 'tsup'

export default defineConfig([

    {
        entry: ["./reader/tunnel-worker/main.ts"],
        splitting: false,
        sourcemap: true,
        clean: true,
        dts: true,
        format: ["esm"],
        outDir: "./dist/reader/tunnel-worker",
        ignoreWatch: [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
        ]
    },
    {
        entry: ["./reader/aptos-trekker/main.ts"],
        outDir: "./dist/reader/aptos-trekker",
        splitting: false,
        sourcemap: true,
        clean: true,
        dts: true,
        format: ["esm"],
        ignoreWatch: [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
        ]
    },
    {
        entry: ["./harpoon/index.ts"],
        outDir: "./dist/harpoon",
        splitting: false,
        sourcemap: true,
        clean: true,
        dts: true,
        format: ["esm"],
        ignoreWatch: [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
        ]
    },
])