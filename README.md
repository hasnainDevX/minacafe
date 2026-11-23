This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Cloudflare Workers deployment

Mina uses server-side dashboard authentication and Sanity settings endpoints. Deploy the Worker; do not use Seri's static out export configuration.

Cloudflare Workers Builds settings:
- Worker name: minacafe
- Build command: leave blank (Wrangler runs the Cloudflare build automatically)
- Deploy command: npm run deploy:cloudflare
- Root directory: repository root
- Node.js: 22 or newer

Add these encrypted **runtime Secrets** in Workers > minacafe > Settings > Variables and Secrets: DASHBOARD_PASSWORD, DASHBOARD_SESSION_SECRET (32+ characters), SANITY_API_WRITE_TOKEN. Keep their existing local values; do not put them in Wrangler or Git. Build variables alone do not configure runtime secrets.

Wrangler includes the public SITE_URL, Sanity project/dataset, and MINA_CLOUDFLARE flag. For login through a workers.dev preview, add a runtime variable DASHBOARD_ALLOWED_ORIGINS with its exact https origin (no /dashboard path). No wildcard hostnames are accepted. The final minacafe.online domain is already allowed.

Local checks: npm run build, then npm run check:cloudflare (builds and bundles without publishing). After building, npm run preview:cloudflare serves the Worker locally.

Cloudflare uses unoptimized image URLs to avoid requiring a paid Images binding. Static shells use the read-only asset cache; live Sanity reads bypass it. This setup does not require R2, D1 or KV. Robots and sitemap are statically generated under Cache Components, so they must not export force-static.

Reference: https://opennext.js.org/cloudflare/get-started

Verified locally: standard Next.js build, OpenNext Worker build, Wrangler dry-run, 21 unit tests, and Workers HTTP checks for public pages, metadata routes, login/logout and protected settings. The compressed Worker was approximately 1.36 MiB. These checks do not publish the site.

Wrangler has a custom build hook, so npm run deploy:cloudflare or npx wrangler deploy generates .open-next/worker.js and the static cache before uploading. Do not commit .open-next; it is generated during deployment. An extra dashboard build command is unnecessary.
