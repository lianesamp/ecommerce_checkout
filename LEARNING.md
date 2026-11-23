# Learning Glossary

New terms and concepts I learned while building this project.

---

## Tools & Configuration

| Term | Explanation |
|------|-------------|
| **Vite** | A fast build tool and dev server for modern web apps. Uses native ES modules in dev (no bundling) for instant HMR. Similar to Laravel Mix/Vite but for pure frontend projects. |
| **Vitest** | A unit test runner built on top of Vite. It reuses your Vite config (plugins, transforms) so tests run in the same environment as your app. The React equivalent of PHPUnit. |
| **jsdom** | A pure JavaScript implementation of the browser DOM that runs in Node.js. Vitest uses it so component tests can render HTML without opening a real browser. |
| **Playwright** | An E2E testing framework by Microsoft that controls real browsers (Chromium, Firefox, WebKit). Tests interact with your app like a real user would. |
| **oxlint** | A very fast linter written in Rust. Vite 8 ships it by default instead of ESLint. Same idea (catch code issues) but much faster. |
| **MSW (Mock Service Worker)** | A library that intercepts network requests at the service worker level. You define fake API handlers and your app thinks it's talking to a real server. Used in dev and tests. |
| **Tailwind CSS v4** | A utility-first CSS framework. v4 uses a CSS-based config (`@import "tailwindcss"`) instead of the old `tailwind.config.js`. |

## Patterns & Concepts

| Term | Explanation |
|------|-------------|
| **`z.infer<typeof schema>`** | Derives a TypeScript type from a Zod schema. Single source of truth — change the schema and the type updates automatically. Like if Laravel Form Request rules also generated a typed DTO. |
| **Barrel export** | An `index.ts` file that re-exports from multiple files in a folder (e.g. `export type { Product } from './product'`). Lets you import from the folder path instead of individual files. |
| **Zod `z.enum()`** | Creates a schema that only allows specific string values — like a TypeScript `'a' | 'b'` union but validated at runtime too. Used for shipping method IDs. |
| **Schema-derived types** | Instead of defining a TypeScript `interface` and a Zod schema separately (which can go out of sync), define the Zod schema first and derive the type. The schema is the source of truth. |
