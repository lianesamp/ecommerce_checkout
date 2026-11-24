# Checkout — E-commerce Storefront

A small e-commerce storefront with a shopping cart and multi-step checkout flow, built to learn **frontend testing** (unit, component, E2E) and **CI with GitHub Actions**.

No real backend — [MSW](https://mswjs.io/) intercepts API calls and returns mock data, so the app works fully standalone.

## Features

- Product catalog with category filtering and price sorting
- Shopping cart with quantity controls, coupon codes, and localStorage persistence
- 3-step checkout: contact form (Spanish address validation) → shipping method → order review
- Order confirmation with generated order number
- Fully responsive (mobile-first with Tailwind)

## Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript 7 (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand (cart with localStorage persistence) |
| Forms | React Hook Form + Zod validation |
| Data fetching | TanStack Query |
| API mocking | MSW (Mock Service Worker) |
| Unit/Component tests | Vitest + React Testing Library + user-event |
| E2E tests | Playwright (Chromium) |
| CI | GitHub Actions (3 parallel jobs) |
| Deployment | Vercel |

## How to Run

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173` with MSW serving mock product data.

## How to Run Tests

```bash
# Unit and component tests (100 tests)
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage

# E2E tests (builds the app, then runs Playwright)
npm run e2e

# E2E with interactive UI
npm run e2e:ui
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint with oxlint |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm test` | Run unit and component tests |
| `npm run test:coverage` | Run tests with v8 coverage |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run e2e:ui` | Run E2E tests with Playwright UI |

## Testing Strategy

| Level | Tool | Count | What it tests |
|-------|------|-------|---------------|
| Unit | Vitest | 32 | Pure business logic: pricing, coupons, order numbers |
| Component | Vitest + RTL | 63 | React components in jsdom: forms, cart, checkout steps |
| Store | Vitest | 21 | Zustand stores without React (plain JS) |
| E2E | Playwright | 5 | Full happy path + validation errors in real Chromium |

Business logic lives in `src/lib/` with 100% test coverage (TDD: tests written first).

## CI Pipeline

GitHub Actions runs 3 parallel jobs on every push and PR:

1. **Lint & Typecheck** — oxlint + `tsc --noEmit`
2. **Unit & Component Tests** — Vitest with coverage report
3. **E2E Tests** — Playwright in headless Chromium

## Project Structure

```
src/
├── api/            # TanStack Query hooks
├── components/
│   ├── cart/       # CartDrawer, CartItem (+tests)
│   ├── catalog/    # ProductCard, ProductGrid, filters (+tests)
│   └── checkout/   # ContactStep, ShippingStep, ReviewStep (+tests)
├── lib/            # Pure business logic (+tests, TDD)
├── mocks/          # MSW handlers and mock data
├── pages/          # CatalogPage, CheckoutPage, ConfirmationPage
├── schemas/        # Zod validation schemas
├── store/          # Zustand stores (+tests)
└── types/          # Shared TypeScript types
e2e/                # Playwright E2E tests
```

## Deploy

Deployed on Vercel with `VITE_ENABLE_MOCKS=true` so MSW serves mock data in production (no real backend needed for this portfolio demo).

To deploy your own:
1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variable: `VITE_ENABLE_MOCKS=true`
4. Deploy — Vercel auto-detects Vite

## What I Learned

See [LEARNING.md](./LEARNING.md) for a detailed glossary of every concept, pattern, and tool learned during this project — with comparisons to Laravel and Vue.
