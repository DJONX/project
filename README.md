# Cameroon Merchants Monorepo

Welcome to the production-grade monorepo setup for **Cameroon Merchants Platform**. This platform is a managed service designed to put Cameroonian merchants online with sector-specific storefront templates using WhatsApp as a lightweight checkout mechanism.

To read the comprehensive context, vision, architectural decisions, and constraints of this project, check out [CONTEXT.md](./CONTEXT.md).

---

## Workspace Structure

This monorepo uses **pnpm workspaces** with the following directories:

### Applications (`/apps`)

- `/apps/storefront` – The mobile-first micro-site rendered from merchant configuration.
- `/apps/marketplace` – The central aggregator site listing products for cross-discovery.
- `/apps/staff-console` – The internal tool used by staff to onboard merchants quickly.

### Packages (`/packages`)

- `/packages/config-schema` – The strict Zod schema validating merchant configurations.
- `/packages/ui` – Shared primitives (e.g. Buttons) and the base Tailwind config.
- `/packages/templates` – Sector-specific presentation templates (Boutique, Restaurant, etc.).

---

## Local Development Setup

Follow these simple steps to get all three Next.js apps up and running locally within **10 minutes**:

### Prerequisites

- Node.js v22+
- pnpm v10+ (configured via `packageManager` in `package.json`)

### Step 1: Clone the repository and Install Dependencies

```bash
# Install all dependencies across all packages and apps
pnpm install
```

### Step 2: Configure Environment Variables

Copy the placeholder environment variable files in each app:

```bash
cp apps/storefront/.env.example apps/storefront/.env.local
cp apps/marketplace/.env.example apps/marketplace/.env.local
cp apps/staff-console/.env.example apps/staff-console/.env.local
```

_(No real keys are required to boot up the apps, they fallback gracefully or read placeholders)_

### Step 3: Run the Development Server

You can boot up the individual Next.js applications in development mode or all at once:

- **To run all applications concurrently:**
  ```bash
  pnpm --parallel dev
  ```
- **To run a single application:**
  ```bash
  pnpm --filter storefront dev
  # or
  pnpm --filter marketplace dev
  # or
  pnpm --filter staff-console dev
  ```

---

## Build, Test, and Verify

We maintain rigorous standards using TypeScript in **strict** mode and ESLint + Prettier.

### Build All Workspaces

To compile package declarations and build Next.js applications:

```bash
pnpm -r build
```

### Run Tests

To run unit and integration tests across the monorepo workspace via **Vitest**:

```bash
pnpm test
```

### Code Style & Linting

Ensure type-safety and formatting standards are maintained:

```bash
# Run linting check (TypeScript + ESLint configs)
pnpm lint

# Run strict type checking on all packages and apps
pnpm typecheck

# Format files using Prettier
pnpm format
```

_(Note: Using `any` type is strictly forbidden and will fail compilation and lint stages)._
