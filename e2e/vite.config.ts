import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext", // you can also use 'es2020' here
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", // you can also use 'es2020' here
    },
  },
  // Conditionally set the `base` for production
  base: "/get-starknet/",
})
