# Bariq Watches Store

A simple Node.js + Express storefront with a static frontend and REST API for managing products, orders, and discounts.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   - Copy `.env.example` to `.env` and adjust values as needed.
   - For production/Vercel deploys, provision a Vercel Postgres database (or supply compatible `POSTGRES_URL` variables) so products/orders persist between requests.
3. **Run in development**
   ```bash
   npm start
   ```
4. Visit `http://localhost:3000` for the storefront or `http://localhost:3000/admin.html` for the dashboard (after login).
   - Default admin: **ebrahem57 / 01023836244** (configurable via `.env`).

## API Overview

| Method | Endpoint                      | Description                          | Auth |
|--------|-------------------------------|--------------------------------------|------|
| POST   | `/api/login`                  | Returns admin token                  | No   |
| GET    | `/api/products`               | List products                        | No   |
| POST   | `/api/products`               | Create product                       | Yes  |
| PUT    | `/api/products/:id`           | Update product                       | Yes  |
| DELETE | `/api/products/:id`           | Delete product                       | Yes  |
| POST   | `/api/products/reset`         | Reset products to defaults           | Yes  |
| GET    | `/api/discounts`              | List discounts                       | Yes  |
| POST   | `/api/discounts`              | Create discount                      | Yes  |
| PUT    | `/api/discounts/:id`          | Update discount                      | Yes  |
| DELETE | `/api/discounts/:id`          | Delete discount                      | Yes  |
| POST   | `/api/discounts/reset`        | Reset discounts to defaults          | Yes  |
| GET    | `/api/discounts/validate/:code` | Validate public discount code      | No   |
| GET    | `/api/orders`                 | List orders                          | Yes  |
| POST   | `/api/orders`                 | Create order                         | No   |
| PATCH  | `/api/orders/:id/status`      | Update order status                  | Yes  |
| DELETE | `/api/orders/:id`             | Delete specific order                | Yes  |
| DELETE | `/api/orders`                 | Delete all orders                    | Yes  |

Use the `Authorization: Bearer <ADMIN_TOKEN>` header for endpoints marked with **Yes** under Auth.

## Frontend Integration

- The storefront (`frontend/script.js`) fetches products and sends orders through the API.
- The admin dashboard (`frontend/admin-script.js`) loads and mutates the same data via authenticated requests.

## Data Storage

- JSON files under `data/` act as a lightweight datastore (`products.json`, `discounts.json`, `orders.json`).
- Default seed data lives in `data/defaults.js`.

## Notes

- For production, wire the storage layer to a real database and tighten authentication (use JWTs, HTTPS, etc.).
- The current setup is aimed at local demos and rapid prototyping.

## Deploying to Vercel

1. **Create a Vercel project** pointing to this repository.
2. **Add a Vercel Postgres database** (from the Integrations tab) and expose the generated credentials (`POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`, `POSTGRES_PRISMA_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL`, or a generic `DATABASE_URL`). The API automatically switches to Postgres when any of these variables are present; otherwise it falls back to local JSON files (not persistent on Vercel).
3. **Configure additional environment variables** in the Vercel dashboard:
   - `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_TOKEN`
4. **Deploy**: `vercel --prod` (or let the GitHub integration build). Static files from `frontend/` are served via `vercel.json`, and the REST API runs through the shared Express router exported in `api/index.js`.
5. **Verify** by opening the assigned Vercel URL, logging in via the modal, and ensuring the admin dashboard shows Postgres-backed data.
