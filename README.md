# Checkout — E-commerce Storefront

A small e-commerce storefront with a shopping cart and multi-step checkout flow, built to learn **frontend testing** (unit, component, E2E) and **CI with GitHub Actions**.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 8**
- **Zustand** for cart state (persisted to localStorage)
- **React Hook Form** + **Zod** for checkout form validation
- **TanStack Query** for data fetching
- **MSW** (Mock Service Worker) for API mocking in dev and tests
- **Tailwind CSS v4**
- **Vitest** + **React Testing Library** + **user-event** for unit/component tests
- **Playwright** for E2E tests
- **GitHub Actions** for CI

## How to Run

```bash
npm install
npm run dev
```

## How to Run Tests

```bash
# Unit and component tests
npm test

# Unit tests in watch mode
npm run test:watch

# Tests with coverage report
npm run test:coverage

# E2E tests (requires build first)
npm run build
npm run e2e
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |
| `npm run typecheck` | Run TypeScript compiler (no emit) |
| `npm test` | Run unit and component tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e` | Run Playwright E2E tests |

## What I Learned

See [LEARNING.md](./LEARNING.md) for a glossary of concepts learned during this project.
