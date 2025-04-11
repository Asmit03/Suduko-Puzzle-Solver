import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '127.0.0.1', // Use localhost
    port: 5173, // Default Vite port
    strictPort: false, // Allow port fallback
    open: true, // automatically open browser
    cors: true, // enable CORS
    hmr: {
      protocol: 'ws',
      host: '127.0.0.1'
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
}));
