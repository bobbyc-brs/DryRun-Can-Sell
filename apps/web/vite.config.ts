// Copyright (C) 2026 Brighter Sight Inc. <info@BrighterSight.ca>
// SPDX-License-Identifier: GPL-3.0-or-later

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Dev ports: `26` + calendar day (DD) + slot (0 = web, 1 = API). Override with VITE_PORT / VITE_API_PORT. */
function defaultWebDevPort(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  return Number.parseInt(`26${dd}0`, 10)
}
function defaultApiDevPort(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0')
  return Number.parseInt(`26${dd}1`, 10)
}

const webPort = Number(process.env.VITE_PORT ?? defaultWebDevPort())
const apiPort = Number(process.env.VITE_API_PORT ?? defaultApiDevPort())

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: webPort,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
})
