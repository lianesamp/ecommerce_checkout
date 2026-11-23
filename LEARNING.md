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
