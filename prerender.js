import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// Polyfill browser globals before importing the SSR bundle
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)) },
    removeItem: (k) => { store.delete(k) },
    clear: () => { store.clear() },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size },
  }
}
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = globalThis.localStorage
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = { localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage }
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Only prerender public-facing routes (skip auth/admin pages that depend on client-only state)
const PUBLIC_ROUTES = ['/', '/imoveis', '/sobre', '/contato']

;(async () => {
  for (const route of PUBLIC_ROUTES) {
    try {
      const appHtml = render(route)
      const html = template.replace(`<!--app-html-->`, appHtml)
      const filePath = `dist${route === '/' ? '/index' : route}.html`
      fs.mkdirSync(path.dirname(toAbsolute(filePath)), { recursive: true })
      fs.writeFileSync(toAbsolute(filePath), html)
      console.log('pre-rendered:', filePath)
    } catch (err) {
      console.error('failed to prerender', route, err)
      process.exit(1)
    }
  }
})()
