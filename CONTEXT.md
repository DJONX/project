0.1 What this is

{{BRAND_NAME}} is not an e-commerce SaaS. It is a managed service that puts Cameroonian merchants online, using a small number of professionally designed, sector-specific storefront templates, with WhatsApp as the checkout mechanism (not a payment gateway) in phase 1. The company's staff sets up each merchant's store — merchants do not self-serve at launch. The software exists to make the staff's job fast and consistent, not to make merchants into web developers.

Non-negotiable positioning: we sell "we put your business online and handle everything," not "we sell you a website." Every piece of software built under this program must make that promise true — meaning setup for a new merchant must be measured in minutes of staff time, not hours of engineering time.

0.2 The three surfaces (build in this order, not in parallel)
Storefront — one live, mobile-first micro-site per merchant, generated from a sector template + that merchant's config data. This is what customers see.
Central Marketplace — one aggregator site listing products from every onboarded merchant, with search and category browsing, for cross-discovery.
Staff Console (internal, not public, not self-serve) — the tool our team uses to onboard a merchant in minutes: fill a form, upload photos, pick a template, get a live link.

Admin/analytics/moderation are extensions of the Staff Console, not a separate fourth product.

0.3 Tech stack (fixed — do not deviate task to task)
Framework: Next.js 15 (App Router), TypeScript, strict mode on.
Styling: Tailwind CSS. No component library beyond what's built in-house for this project (keeps every template visually distinct — see 0.5).
Data + Auth + Storage: Supabase (Postgres, Supabase Auth, Supabase Storage for product photos).
Hosting assumption: Vercel for the Next.js apps, Supabase cloud for the backend. Do not introduce Docker, Kubernetes, or a custom server — this is intentionally a low-ops stack a 2-person team can run.
Package manager: pnpm.
Testing: Vitest for unit tests, Playwright for the critical end-to-end flow only (product view → WhatsApp click). Do not build exhaustive E2E coverage — this is a lean startup, not an enterprise codebase.
Monorepo layout:
/apps/storefront -> renders any merchant's store from their config
/apps/marketplace -> the central aggregator site
/apps/staff-console -> internal tool, auth-gated, not indexed by search engines
/packages/config-schema -> the Zod schema + types every app imports (single source of truth)
/packages/templates -> the sector templates (see 0.5), pure presentational components
/packages/ui -> shared primitives ONLY where sharing doesn't erase template identity
0.4 The core architectural rule: config-driven templates

This is the single most important technical decision in the whole project, and it must not be violated by any task: a merchant is data, not code.

A merchant's entire store is one JSON/DB record validated against a strict schema (packages/config-schema): business name, sector, logo URL, color palette, WhatsApp number, list of products (name, price, photo URLs, description, category, in-stock flag), social links, verified-badge status.
Onboarding a new merchant = staff fills a form in the Staff Console = one new config record is created = the Storefront app renders their sector's template with that data at {{DOMAIN}}/{slug}.
It must never require writing or copying code to onboard a merchant. If a task's implementation would require a developer to touch code per merchant, that task has failed its brief, no matter how good the output looks.
0.5 Sector templates (build exactly these ten, in this priority order)
Boutique de vêtements (fashion/clothing)
Restaurant / food
Cosmétiques & beauté
Pharmacie / santé
Électronique
Immobilier
Artisan / fait-main
Formateur / cours & coaching
Librairie / papeterie
Supermarché / épicerie

Each template must be visually distinct — different layout rhythm, different way of presenting a "product" (a restaurant needs a menu-card layout, real estate needs a listing-with-specs layout, a course needs a session/curriculum layout — do not force every sector into the same generic product-grid). All ten share the same config schema and the same WhatsApp CTA mechanism, but must not look like reskins of one template with swapped colors. This is a direct, deliberate reaction against generic template marketplaces where every storefront looks the same — visual distinctiveness per sector is a product requirement, not a nice-to-have.

0.6 WhatsApp ordering flow (the spine of the whole product)

Exact flow, do not simplify or "improve" it without asking:

Customer browses the storefront (or a product page reached from the Marketplace, a shared link, or a QR code).
Customer selects one or more products (single-product stores: a straightforward "Order on WhatsApp" button; catalog stores: a lightweight cart).
Customer taps Order / Commander → this must: a. Log a lead record server-side first (product id(s), timestamp, referrer source) — this is how we get analytics and this is the seed of the future "orders live in a dashboard, not just in someone's WhatsApp inbox" capability that phase 2 needs. Never skip this logging step to "keep it simple" — losing this data defeats the whole analytics value proposition. b. Then open https://wa.me/{{merchant_whatsapp_number}}?text={{url_encoded_prefilled_message}}. The prefilled message must include: product name(s), quantity, and a short reference code that matches the lead record so the merchant can find it later.
No payment happens in this flow in phase 1. Do not build a payment field, a payment button, or any Mobile Money integration in any task unless a task brief explicitly says so — this is deliberately deferred (see 0.8).
0.7 Non-functional requirements that apply to every task
Mobile-first, always. Assume the primary device is a mid-range Android phone on an inconsistent connection. Test every storefront page at 360px width first, desktop second. Images must be lazy-loaded and compressed — do not ship unoptimized photo uploads directly.
French-first UI copy, with the codebase structured (simple key-based i18n, not hardcoded strings) so English can be added later without a rewrite.
Every storefront page must be a static/ISR page where possible — these are read mostly, written rarely (only when staff updates a catalog). Do not make every page a client-side-rendered dashboard-style app; that's slow on cheap phones and bad for search visibility.
No merchant's data or photos are ever visible to another merchant in the Staff Console, even though products are visibly aggregated to customers on the Marketplace.
0.8 Explicit guardrails — what NOT to build until told to
No live payment or Mobile Money integration of any kind. Confirmation of payment stays a manual, human step in the WhatsApp conversation for the entire first phase. This will be a separate, later task with its own dedicated security review — do not pre-build scaffolding for it "to save time later."
No public merchant self-signup flow. Onboarding is staff-driven through the Staff Console only, for now.
No commission/percentage billing logic anywhere in the code. Revenue is flat setup fee + flat monthly subscription, tracked manually or via a simple invoice record — never derived automatically from order volume, since we have no reliable visibility into whether a WhatsApp conversation became a real sale.
