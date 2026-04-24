// Polyfill browser globals for SSR before importing the App
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  // @ts-ignore
  globalThis.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
}
if (typeof globalThis.sessionStorage === 'undefined') {
  // @ts-ignore
  globalThis.sessionStorage = globalThis.localStorage;
}

import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  return html;
}
