# Backend Study Guide

Interactive study guide for frontend engineers learning backend concepts.

Based on the [Backend from First Principles](https://www.youtube.com/playlist?list=PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1) YouTube playlist by Sriniously.

**Live site:** https://YOUR_USERNAME.github.io/backend-study-guide/

## What's inside

- 54 backend concepts with frontend-friendly explanations (including a full Node.js section)
- Runnable Node.js course examples in `examples/nodejs/`
- Code examples for every topic
- Interactive HTTP request builder
- Middleware pipeline visualizer
- Quick quizzes with instant feedback
- Progress tracking (saved in your browser)

## Topics

| Phase | Concepts |
|-------|----------|
| Foundations | HTTP, Servers, Routing, Serialization |
| **Node.js** | npm, TypeScript, process, path/os/crypto, timers, async/await, fs, buffers, URL, EventEmitter, streams, HTTP module, fetch, runtime internals, cluster |
| Security & Pipeline | Auth, Validation, Middleware, CORS, Rate Limiting, Request Context |
| Application Layer | MVC, CRUD, REST, GraphQL, Pagination, Idempotency, Databases, Migrations, Transactions, Business Logic |
| Data & Performance | Caching, Emails, Queues, Elasticsearch, Errors |
| Operations | Logging, Security, Scaling, Webhooks, DevOps, and more |

## Run locally

No build step needed — just open the file or use any static server:

```bash
# Option 1: Python
cd backend-study-guide
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: npx
npx serve .
```

### Run Node.js examples

Course companion files live in `examples/nodejs/`. Run any file with `tsx` or `ts-node`:

```bash
npm install -g tsx
tsx examples/nodejs/01-basic-http-server.ts
tsx examples/nodejs/02-routing.ts
```

## Deploy to GitHub Pages (free) — one command

```bash
cd backend-study-guide
./deploy.sh YOUR_GITHUB_USERNAME
```

Then enable Pages: **Settings → Pages → Source → GitHub Actions**

Your site: `https://YOUR_GITHUB_USERNAME.github.io/backend-study-guide/`

### Manual deploy

```bash
git init
git add .
git commit -m "Initial commit: backend study guide"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/backend-study-guide.git
git push -u origin main
```

3. Go to **Settings → Pages → Build and deployment**
4. Set **Source** to **GitHub Actions**
5. The included workflow deploys automatically on every push to `main`

Your site will be live at: `https://YOUR_USERNAME.github.io/backend-study-guide/`

## Other free hosting options

- **Vercel** — drag & drop the folder at [vercel.com](https://vercel.com)
- **Netlify** — drag & drop at [netlify.com](https://netlify.com)
- **Cloudflare Pages** — connect repo at [pages.cloudflare.com](https://pages.cloudflare.com)

## License

MIT — use freely for learning.
