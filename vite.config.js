import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every asset URL relative, so the build works on
// https://<user>.github.io/krishvaya/ or any other sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
})
