const NODEJS_PHASE = "Node.js";

const nodejsConcepts = [
  {
    id: "node-setup",
    title: "Node.js, npm & package.json",
    phase: NODEJS_PHASE,
    summary:
      "Node.js is a JavaScript runtime built on Chrome's V8 engine — it lets you run JavaScript outside the browser, on servers, CLIs, and scripts. npm (Node Package Manager) installs third-party libraries and ships with Node. Every Node project has a `package.json` that declares the project name, dependencies, and scripts you run with `npm run <script>`.",
    frontendAnalogy:
      "If React/Vite is your frontend toolchain, Node + npm is the backend equivalent. `package.json` is like your frontend `package.json` — same format, same `npm install` workflow. You already use npm for frontend deps; backend projects work identically.",
    backendPerspective:
      "You initialize a project with `npm init -y`, add dependencies with `npm install express` (saved to `dependencies`) or `npm install -D typescript` (saved to `devDependencies`). Scripts in `package.json` define how to start, build, and test — e.g. `\"dev\": \"tsx watch src/index.ts\"`. Use `node_modules/` for installed packages (gitignored) and commit `package-lock.json` for reproducible installs.",
    keyPoints: [
      "Node.js runs JavaScript on the server — event-driven, non-blocking I/O by default.",
      "`package.json` — project manifest: name, version, scripts, dependencies, engines.",
      "`npm install` — reads package.json and installs deps into `node_modules/`.",
      "Scripts — `\"start\": \"node dist/index.js\"` → run with `npm start` (no `run` needed) or `npm run dev`.",
      "`dependencies` vs `devDependencies` — runtime packages vs build/test tools only needed in development.",
    ],
    terminology: [
      {
        term: "npm",
        definition:
          "Node Package Manager — installs packages from the npm registry, runs scripts, and manages versions via package-lock.json.",
      },
      {
        term: "package.json",
        definition:
          "JSON manifest for your Node project. Lists dependencies, scripts, and metadata. Every Node backend starts here.",
      },
      {
        term: "node_modules",
        definition:
          "Folder where npm installs packages. Can be huge — never commit it; regenerate with `npm install`.",
      },
    ],
    example: {
      title: "package.json essentials",
      language: "json",
      code: `{
  "name": "my-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  },
  "engines": { "node": ">=20.0.0" }
}

# Common commands
npm install          # install all deps
npm install zod      # add runtime dependency
npm run dev          # start dev server`,
    },
    quiz: {
      question: "Where does npm install packages?",
      options: [
        "In package.json directly",
        "In the node_modules folder",
        "In the global system registry only",
        "In src/",
      ],
      correctIndex: 1,
      explanation:
        "npm downloads packages into node_modules/. package.json only lists what to install.",
    },
  },
  {
    id: "node-typescript",
    title: "TypeScript & tsconfig.json",
    phase: NODEJS_PHASE,
    summary:
      "Most production Node backends use TypeScript for type safety. The `tsconfig.json` file tells the TypeScript compiler how to compile your `.ts` files to `.js` — target ECMAScript version, module system (CommonJS vs ESM), strict mode, and output directory. Tools like `tsx` or `ts-node` let you run TypeScript directly in development without a separate compile step.",
    frontendAnalogy:
      "Same `tsconfig.json` you use in a React or Next.js project — the options are nearly identical. If you know TypeScript on the frontend, you already know 80% of Node TypeScript setup.",
    backendPerspective:
      "Set `\"module\": \"NodeNext\"` and `\"moduleResolution\": \"NodeNext\"` for modern ESM in Node 20+. Use `\"strict\": true` to catch bugs at compile time. Output compiled JS to `dist/` with `\"outDir\": \"./dist\"`. In dev, `tsx watch src/index.ts` compiles on the fly; in production, `tsc && node dist/index.js`.",
    keyPoints: [
      "`tsconfig.json` — compiler options: target, module, strict, outDir, rootDir.",
      "ESM vs CommonJS — `\"type\": \"module\"` in package.json enables `import/export`; use NodeNext resolution.",
      "`strict: true` — enables null checks, no implicit any; catches bugs before runtime.",
      "`tsx` / `ts-node` — run `.ts` files directly in development without manual compile.",
      "Compile for production — `tsc` outputs `.js` to `dist/`; deploy `dist/`, not `src/`.",
    ],
    example: {
      title: "tsconfig.json for a Node API",
      language: "json",
      code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
    },
    quiz: {
      question: "What does `\"strict\": true` in tsconfig.json do?",
      options: [
        "Makes the server run faster",
        "Enables stricter type checking to catch more bugs at compile time",
        "Disables TypeScript errors in production",
        "Converts JS to TS automatically",
      ],
      correctIndex: 1,
      explanation:
        "strict mode enables null checks, no implicit any, and other safety flags. Always use it in production projects.",
    },
  },
  {
    id: "node-process",
    title: "The Process Object",
    phase: NODEJS_PHASE,
    summary:
      "Every Node.js program runs as a process, and `process` is a global object with information and control over that process. You read environment variables via `process.env`, command-line arguments via `process.argv`, and exit codes via `process.exit()`. Config, secrets, and feature flags almost always come from `process.env` in backend apps.",
    frontendAnalogy:
      "`process.env` is the server-side equivalent of `import.meta.env` in Vite or `process.env.NEXT_PUBLIC_*` in Next.js — environment variables injected at runtime. On the backend there is no `NEXT_PUBLIC_` prefix; all env vars are server-only and secret-safe.",
    backendPerspective:
      "Load config at startup: `const port = Number(process.env.PORT) || 3000`. Never hardcode secrets — use `process.env.DATABASE_URL`, `process.env.JWT_SECRET`. `process.argv` gives CLI args for scripts. Listen for `SIGTERM` and `SIGINT` on `process` for graceful shutdown. `process.cwd()` returns the current working directory.",
    keyPoints: [
      "`process.env` — environment variables (DATABASE_URL, PORT, NODE_ENV).",
      "`process.argv` — command-line arguments; `argv[0]` is node, `argv[1]` is script path, rest are your args.",
      "`process.exit(code)` — terminate the process; 0 = success, non-zero = error.",
      "`process.on('SIGTERM', ...)` — handle shutdown signals from Kubernetes or Ctrl+C.",
      "`NODE_ENV` — convention: `development`, `production`, `test`; toggles logging and error detail.",
    ],
    example: {
      title: "Reading config from process.env",
      language: "typescript",
      code: `// .env (never commit!) → loaded by dotenv at startup
// PORT=3000
// DATABASE_URL=postgres://...
// JWT_SECRET=super-secret

const config = {
  port: Number(process.env.PORT) || 3000,
  dbUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  isProd: process.env.NODE_ENV === 'production',
};

// CLI args: node script.js --user=42
const args = process.argv.slice(2);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});`,
    },
    quiz: {
      question: "Where should JWT_SECRET be read from in a Node backend?",
      options: [
        "Hardcoded in source code",
        "process.env.JWT_SECRET",
        "A JSON file committed to git",
        "The frontend bundle",
      ],
      correctIndex: 1,
      explanation:
        "Secrets belong in environment variables, read via process.env at startup. Never commit them to source control.",
    },
  },
  {
    id: "node-core-modules",
    title: "path, os & crypto Modules",
    phase: NODEJS_PHASE,
    summary:
      "Node ships with built-in core modules — no npm install needed. `path` handles file/directory paths in an OS-safe way. `os` exposes operating system info (CPU, memory, platform). `crypto` provides hashing, encryption, and random bytes — essential for password hashing, JWT signing, and generating secure tokens.",
    frontendAnalogy:
      "Browsers don't have these — path joining and file hashing are server concerns. On the frontend you might use `crypto.subtle` in the browser for some hashing; on Node, `import crypto from 'node:crypto'` gives you the full toolkit including bcrypt-friendly primitives.",
    backendPerspective:
      "Use `path.join(__dirname, 'uploads', filename)` instead of string concatenation — handles Windows vs Unix slashes. `crypto.randomBytes(32).toString('hex')` generates secure tokens. `crypto.createHash('sha256').update(data).digest('hex')` for checksums. For passwords use `bcrypt` or `argon2` (npm packages), not raw SHA-256. Import with `node:` prefix: `import path from 'node:path'`.",
    keyPoints: [
      "`path.join(...)` — safely join path segments; use instead of `'dir' + '/' + file`.",
      "`path.resolve()` — absolute path from relative segments; useful for config file locations.",
      "`os.platform()` — `'darwin'`, `'linux'`, `'win32'`; rarely needed but useful for cross-platform tools.",
      "`crypto.randomBytes(n)` — cryptographically secure random data for tokens and session IDs.",
      "`crypto.createHash('sha256')` — one-way hashing for checksums; use bcrypt/argon2 for passwords.",
    ],
    terminology: [
      {
        term: "Core module",
        definition:
          "Built-in Node module (path, fs, http, crypto) — import with `node:moduleName`, no npm install required.",
      },
      {
        term: "path.join",
        definition:
          "Joins path segments with the correct separator for the OS. Prevents bugs from hardcoded `/` or `\\`.",
      },
    ],
    example: {
      title: "path and crypto in practice",
      language: "typescript",
      code: `import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// ESM equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadPath = path.join(__dirname, '..', 'uploads', 'avatar.jpg');
// → /app/uploads/avatar.jpg (OS-correct separators)

// Secure random token for password reset link
const resetToken = crypto.randomBytes(32).toString('hex');

// SHA-256 checksum (NOT for passwords — use bcrypt for those)
const hash = crypto.createHash('sha256').update('file-contents').digest('hex');`,
    },
    quiz: {
      question: "Why use path.join() instead of string concatenation for file paths?",
      options: [
        "It's faster",
        "It handles OS-specific separators (/) vs (\\) correctly",
        "It encrypts the path",
        "It's required by TypeScript",
      ],
      correctIndex: 1,
      explanation:
        "path.join uses the correct separator for the OS. Hardcoded slashes break on Windows.",
    },
  },
  {
    id: "node-timers",
    title: "Timers: setTimeout, setInterval & setImmediate",
    phase: NODEJS_PHASE,
    summary:
      "Node provides timer functions to schedule code for later execution. `setTimeout(fn, ms)` runs once after a delay. `setInterval(fn, ms)` runs repeatedly until cleared. `setImmediate(fn)` runs on the next iteration of the event loop — after I/O callbacks. These are how you debounce, poll, and schedule background work without blocking the main thread.",
    frontendAnalogy:
      "Identical API to browser timers — `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval` work the same way. You already use these in React for debouncing search inputs; on the server they're used for delayed jobs, polling, and timeouts.",
    backendPerspective:
      "Use `setTimeout` for simple delays (e.g. retry after 1s). Use `setInterval` sparingly — prefer cron jobs or queue workers for recurring tasks. `setImmediate` vs `process.nextTick`: nextTick runs before I/O, setImmediate runs after. Always `clearInterval` on shutdown to prevent memory leaks. For production scheduling, use `node-cron` or a job queue instead of raw setInterval.",
    keyPoints: [
      "`setTimeout(fn, ms)` — run once after delay; returns a timer ID for `clearTimeout`.",
      "`setInterval(fn, ms)` — run every N ms; must call `clearInterval` when done.",
      "`setImmediate(fn)` — run after current poll phase; good for deferring work without blocking.",
      "`process.nextTick(fn)` — runs before any I/O; can starve the event loop if overused.",
      "Don't use setInterval for critical jobs — use cron or BullMQ for reliability and persistence.",
    ],
    example: {
      title: "Timer patterns in Node",
      language: "typescript",
      code: `// One-time delay — retry logic
function retry(fn, attempts = 3, delay = 1000) {
  return fn().catch((err) => {
    if (attempts <= 1) throw err;
    return new Promise((resolve) =>
      setTimeout(() => resolve(retry(fn, attempts - 1, delay * 2)), delay)
    );
  });
}

// Debounce (simplified)
let debounceTimer: ReturnType<typeof setTimeout>;
function debounce(fn: () => void, ms: number) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, ms);
}

// setImmediate — defer without blocking current code
setImmediate(() => console.log('runs after current sync code'));

// Cleanup on shutdown
const poll = setInterval(checkHealth, 30_000);
process.on('SIGTERM', () => clearInterval(poll));`,
    },
    quiz: {
      question: "What's the difference between setImmediate and setTimeout(fn, 0)?",
      options: [
        "They are identical",
        "setImmediate runs in the check phase; setTimeout runs in the timers phase — order can differ",
        "setTimeout is faster",
        "setImmediate only works in browsers",
      ],
      correctIndex: 1,
      explanation:
        "Both defer execution but run in different event loop phases. setImmediate is preferred for deferring I/O-related work in Node.",
    },
  },
  {
    id: "node-async",
    title: "Callbacks, Promises & async/await",
    phase: NODEJS_PHASE,
    summary:
      "Node.js was built on callbacks — `fs.readFile(path, (err, data) => {})` — but modern code uses Promises and async/await for readability. The callback pattern has error-first convention: `(err, result) => void`. Promises chain with `.then()/.catch()`; async/await is syntactic sugar that makes async code look synchronous. Never mix unhandled promises — always await or `.catch()`.",
    frontendAnalogy:
      "Exact same async/await you use with `fetch()` in React. `async function getUser() { const res = await fetch(...); return res.json(); }` works identically in Node. The main difference: Node has more callback-based legacy APIs — always prefer Promise versions (`fs.promises`, `import { readFile } from 'fs/promises'`).",
    backendPerspective:
      "Write handlers as `async (req, res) => { ... }` in Express. Wrap await calls in try/catch or use an error-handling wrapper. Convert callbacks with `util.promisify(fn)` or use the built-in Promise API (`fs/promises`). Use `Promise.all([...])` for concurrent independent I/O. Never use callbacks in new code unless a library requires it.",
    keyPoints: [
      "Error-first callbacks — `(err, data) => {}`; if err is truthy, handle error first.",
      "Promises — `.then(result => ...).catch(err => ...)`; prefer async/await syntax.",
      "`async/await` — `const data = await readFile(path)`; use try/catch for errors.",
      "`Promise.all([a, b, c])` — run independent async operations concurrently.",
      "`util.promisify` — converts callback-style functions to Promise-returning ones.",
    ],
    terminology: [
      {
        term: "Callback hell",
        definition:
          "Deeply nested callbacks that are hard to read and maintain. Solved by Promises and async/await.",
      },
      {
        term: "Unhandled promise rejection",
        definition:
          "A rejected Promise with no .catch() handler — crashes Node in modern versions. Always handle errors.",
      },
    ],
    example: {
      title: "Callback → Promise → async/await evolution",
      language: "typescript",
      code: `import { readFile } from 'node:fs/promises';

// ❌ Callback style (legacy)
import { readFile as readCb } from 'node:fs';
readCb('config.json', 'utf8', (err, data) => {
  if (err) { console.error(err); return; }
  console.log(JSON.parse(data));
});

// ✅ Promise style
readFile('config.json', 'utf8')
  .then((data) => console.log(JSON.parse(data)))
  .catch(console.error);

// ✅ async/await (preferred)
async function loadConfig() {
  try {
    const data = await readFile('config.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load config:', err);
    throw err;
  }
}

// Concurrent I/O
const [users, orders] = await Promise.all([
  userService.findAll(),
  orderService.findAll(),
]);`,
    },
    quiz: {
      question: "In Node's error-first callback `(err, data) => {}`, what should you check first?",
      options: [
        "data",
        "err — if truthy, handle the error before using data",
        "The file size",
        "Nothing — data is always valid",
      ],
      correctIndex: 1,
      explanation:
        "Always check err first in error-first callbacks. If err is truthy, data is undefined.",
    },
  },
  {
    id: "node-fs",
    title: "File System (fs)",
    phase: NODEJS_PHASE,
    summary:
      "The `fs` module reads, writes, and manages files and directories on disk. It comes in three flavors: synchronous (blocking — avoid in servers), callback-based (legacy), and Promise-based (`fs/promises` — use this). For APIs you rarely read local files directly — databases and object storage (S3) handle persistence — but fs is essential for config files, logs, uploads, and build scripts.",
    frontendAnalogy:
      "Browsers restrict file access for security — you use `<input type='file'>` and FileReader. On the server there are no such restrictions; you read and write the filesystem freely with `fs`. Think of it as unrestricted localStorage on steroids.",
    backendPerspective:
      "Always use `import { readFile, writeFile, mkdir } from 'node:fs/promises'` in async handlers. Check if a file exists with `access()` or catch `ENOENT` errors. Create directories recursively with `mkdir(path, { recursive: true })`. For large files, use streams instead of reading the entire file into memory. Never use synchronous fs APIs (`readFileSync`) in request handlers — they block the event loop.",
    keyPoints: [
      "`fs/promises` — Promise-based API; use in all new async code.",
      "Sync APIs (`readFileSync`) — block the event loop; only for startup scripts or CLI tools.",
      "`ENOENT` error — file or directory not found; handle gracefully.",
      "`mkdir({ recursive: true })` — create nested directories without checking each level.",
      "Streams for large files — don't `readFile` a 500MB upload; pipe a stream instead.",
    ],
    example: {
      title: "fs/promises — read, write, check existence",
      language: "typescript",
      code: `import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';

// Read JSON config
const config = JSON.parse(await readFile('config.json', 'utf8'));

// Write log file (create dir if missing)
await mkdir('logs', { recursive: true });
await writeFile('logs/app.log', \`\${new Date().toISOString()} Server started\\n\`, { flag: 'a' });

// Check if file exists
async function exists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// ❌ Never in a request handler:
// const data = readFileSync('huge-file.csv'); // blocks ALL requests!`,
    },
    quiz: {
      question: "Why avoid readFileSync in an Express request handler?",
      options: [
        "It returns a Promise",
        "It blocks the event loop — no other requests can be processed while reading",
        "It only works on Linux",
        "It deletes the file after reading",
      ],
      correctIndex: 1,
      explanation:
        "Synchronous fs APIs block the single Node thread. Use async fs/promises in servers.",
    },
  },
  {
    id: "node-buffers",
    title: "Buffers",
    phase: NODEJS_PHASE,
    summary:
      "A Buffer is Node's way of handling raw binary data — sequences of bytes for files, network packets, images, and crypto operations. JavaScript strings are Unicode; Buffers are raw bytes. You encounter them when reading files, receiving HTTP request bodies, working with streams, and doing encryption. `Buffer.from('hello')` creates one; `.toString('base64')` encodes it.",
    frontendAnalogy:
      "Browsers have `ArrayBuffer` and `Uint8Array` for binary data. Node's `Buffer` is similar but more ergonomic — it's a Uint8Array subclass with helper methods. When you upload a file in the browser you get a `File`/`Blob`; on the server the raw bytes arrive as a Buffer in the request body or stream.",
    backendPerspective:
      "HTTP request bodies for file uploads arrive as Buffers before you save them. Use `Buffer.concat(chunks)` when collecting stream chunks. Encode/decode: `.toString('base64')`, `Buffer.from(str, 'base64')`. Compare buffers with `buf1.equals(buf2)` — never `===`. For image processing or hashing, libraries like `sharp` and `crypto` accept Buffers directly.",
    keyPoints: [
      "Buffer = fixed-size raw byte array; used for binary data (files, images, network).",
      "`Buffer.from('text', 'utf8')` — create from string; `.toString('utf8')` — back to string.",
      "Base64 encoding — `.toString('base64')` for sending binary in JSON or URLs.",
      "Stream chunks are Buffers — collect with `Buffer.concat(chunks)` before processing.",
      "Don't use Buffer for very large files — use streams to avoid loading everything into memory.",
    ],
    example: {
      title: "Working with Buffers",
      language: "typescript",
      code: `// Create and encode
const buf = Buffer.from('Hello, Node!');
console.log(buf.toString('utf8'));   // 'Hello, Node!'
console.log(buf.toString('base64')); // 'SGVsbG8sIE5vZGUh'
console.log(buf.length);             // 12 bytes

// Decode base64 (e.g. from a data URL)
const imageBuf = Buffer.from(base64String, 'base64');

// Collect stream chunks into one Buffer
const chunks: Buffer[] = [];
for await (const chunk of readableStream) {
  chunks.push(chunk as Buffer);
}
const fullBuffer = Buffer.concat(chunks);

// Secure comparison (timing-safe)
import { timingSafeEqual } from 'node:crypto';
const a = Buffer.from(tokenFromRequest);
const b = Buffer.from(expectedToken);
const valid = a.length === b.length && timingSafeEqual(a, b);`,
    },
    quiz: {
      question: "When do you typically encounter Buffers in a Node API?",
      options: [
        "Only when writing SQL queries",
        "Reading file uploads, stream chunks, and binary HTTP bodies",
        "Only in frontend React code",
        "When parsing JSON",
      ],
      correctIndex: 1,
      explanation:
        "Buffers handle raw binary data — file uploads, streams, and crypto. JSON uses strings, not Buffers.",
    },
  },
  {
    id: "node-url",
    title: "The URL Module",
    phase: NODEJS_PHASE,
    summary:
      "Node's `url` module (and the global `URL` class) parses, constructs, and manipulates URLs. It breaks a URL into protocol, hostname, port, pathname, and searchParams — the same parts you learned in Routing. Use it to safely build URLs, parse query strings, and validate redirect targets instead of string concatenation.",
    frontendAnalogy:
      "The browser has `new URL('https://example.com/path?q=1')` — identical API in Node. You may have used `URLSearchParams` in frontend code to build query strings; it works the same on the server.",
    backendPerspective:
      "Parse incoming request URLs: `new URL(req.url, 'http://localhost')` in plain Node HTTP. Build external API URLs safely: `new URL('/users', 'https://api.example.com')`. Read query params: `url.searchParams.get('page')`. Validate redirect URLs to prevent open-redirect attacks — only allow your own domains.",
    keyPoints: [
      "`new URL(input, base)` — parse absolute or relative URLs; throws on invalid input.",
      "`url.pathname` — path part; `url.searchParams` — query string as URLSearchParams.",
      "`url.searchParams.get('key')` — read a query param; `.set('key', 'val')` to modify.",
      "`URLSearchParams` — build query strings: `new URLSearchParams({ page: '2', limit: '20' })`.",
      "Validate redirect URLs — never redirect to user-supplied URLs without an allowlist.",
    ],
    example: {
      title: "Parsing and building URLs",
      language: "typescript",
      code: `// Parse a request URL (plain Node HTTP server)
const url = new URL(req.url ?? '/', \`http://\${req.headers.host}\`);
const path = url.pathname;           // '/api/users'
const page = url.searchParams.get('page'); // '2'
const limit = Number(url.searchParams.get('limit') ?? 20);

// Build an external API URL safely
const apiUrl = new URL('/v1/users', 'https://api.example.com');
apiUrl.searchParams.set('active', 'true');
// → https://api.example.com/v1/users?active=true

// Validate redirect (prevent open redirect attacks)
const ALLOWED = ['https://myapp.com', 'https://staging.myapp.com'];
function safeRedirect(target: string) {
  const url = new URL(target);
  if (!ALLOWED.some((origin) => url.origin === new URL(origin).origin)) {
    throw new Error('Invalid redirect target');
  }
  return url.toString();
}`,
    },
    quiz: {
      question: "How do you read ?page=2 from a URL in Node?",
      options: [
        "url.pathname",
        "url.searchParams.get('page')",
        "url.hostname",
        "url.protocol",
      ],
      correctIndex: 1,
      explanation:
        "searchParams is a URLSearchParams object. .get('page') returns '2' from ?page=2.",
    },
  },
  {
    id: "node-events",
    title: "EventEmitter",
    phase: NODEJS_PHASE,
    summary:
      "Node's event-driven architecture is built on the EventEmitter pattern. Objects emit named events; listeners register with `.on()` and are called when `.emit()` fires. Many Node core modules (http.Server, fs.ReadStream, process) extend EventEmitter. Use it to decouple components — e.g. emit a 'user:created' event and let email/audit listeners react without the service knowing about them.",
    frontendAnalogy:
      "Like `addEventListener('click', handler)` in the DOM, or React's event system. `emitter.on('event', handler)` registers a listener; `emitter.emit('event', data)` triggers all listeners. `once` is like `{ once: true }` on addEventListener — fires only one time.",
    backendPerspective:
      "Extend EventEmitter for your own domain events: `class OrderService extends EventEmitter { create() { ... this.emit('order:created', order); } }`. Register listeners at app startup. Use `once` for one-time events. Be careful with error events — unhandled 'error' events crash the process. For production decoupling across services, prefer a message queue over in-process EventEmitter.",
    keyPoints: [
      "`.on('event', handler)` — register a listener; called every time the event fires.",
      "`.once('event', handler)` — listener fires at most once, then auto-removed.",
      "`.emit('event', ...args)` — trigger all listeners for that event.",
      "`.off('event', handler)` — remove a specific listener; prevent memory leaks.",
      "Many Node internals use EventEmitter — http.Server emits 'request', streams emit 'data' and 'end'.",
    ],
    example: {
      title: "EventEmitter pattern",
      language: "typescript",
      code: `import { EventEmitter } from 'node:events';

class UserService extends EventEmitter {
  async create(data: { email: string; name: string }) {
    const user = await db.users.insert(data);
    this.emit('user:created', user); // notify listeners
    return user;
  }
}

const userService = new UserService();

// Register listeners at startup
userService.on('user:created', (user) => {
  emailQueue.add('welcome', { to: user.email });
});

userService.once('user:created', (user) => {
  console.log('First user created!', user.id); // fires only once ever
});

// http.Server is an EventEmitter
import { createServer } from 'node:http';
const server = createServer();
server.on('request', (req, res) => { /* handle */ });
server.on('error', (err) => console.error(err)); // always handle errors!`,
    },
    quiz: {
      question: "What's the difference between .on() and .once()?",
      options: [
        ".once() is faster",
        ".on() fires every emit; .once() fires at most one time then removes itself",
        ".once() only works on streams",
        "They are identical",
      ],
      correctIndex: 1,
      explanation:
        "once registers a listener that automatically unsubscribes after the first emit.",
    },
  },
  {
    id: "node-streams",
    title: "Streams",
    phase: NODEJS_PHASE,
    summary:
      "Streams process data piece by piece instead of loading everything into memory. A readable stream produces data (file read, HTTP response); a writable stream consumes it (file write, HTTP request). You pipe them together: `readStream.pipe(writeStream)`. Essential for large files, video, log processing, and real-time data — a 1GB file upload would crash your server with `readFile`, but streams handle it in chunks.",
    frontendAnalogy:
      "Like reading a book page by page instead of memorizing the whole book at once. Browser fetch with `response.body.getReader()` is a readable stream. On the server, streaming a large CSV export to the client avoids building a giant string in memory.",
    backendPerspective:
      "Use `createReadStream` for file downloads and `createWriteStream` for uploads. Pipe HTTP response: `fs.createReadStream('report.csv').pipe(res)`. Transform streams modify data in flight (e.g. gzip compression, CSV parsing). Handle `error` events on all streams in a pipe chain — an unhandled error crashes the process. For file uploads in Express, use `multer` which wraps streams.",
    keyPoints: [
      "Readable — produces data in chunks; emits 'data', 'end', 'error' events.",
      "Writable — consumes data; call `.write(chunk)` and `.end()` when done.",
      "`.pipe(destination)` — connect readable → writable; handles backpressure automatically.",
      "Transform — modify data in flight (zlib.createGzip(), csv parser).",
      "Use streams for anything larger than a few MB — keeps memory usage constant.",
    ],
    terminology: [
      {
        term: "Backpressure",
        definition:
          "When the writer is slower than the reader, streams pause reading automatically. pipe() handles this.",
      },
      {
        term: "Chunk",
        definition:
          "A piece of data emitted by a stream — usually a Buffer. Many chunks make up the full content.",
      },
    ],
    example: {
      title: "Streaming a file download",
      language: "typescript",
      code: `import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

// Stream file to HTTP response (plain Node)
import { createServer } from 'node:http';
createServer((req, res) => {
  if (req.url === '/export') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
    createReadStream('large-export.csv').pipe(res);
    // Memory stays low — only one chunk in memory at a time
  }
}).listen(3000);

// pipeline() — modern alternative to .pipe() with automatic error handling
await pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('input.txt.gz')
);`,
    },
    quiz: {
      question: "Why use streams instead of readFile for a 500MB file?",
      options: [
        "Streams are always faster to write",
        "readFile loads the entire 500MB into memory; streams process it in small chunks",
        "readFile doesn't work on large files",
        "Streams automatically compress the file",
      ],
      correctIndex: 1,
      explanation:
        "readFile buffers the entire file in RAM. Streams process chunk by chunk, keeping memory usage low.",
    },
  },
  {
    id: "node-http",
    title: "HTTP Module (plain Node)",
    phase: NODEJS_PHASE,
    summary:
      "Before Express, there is the built-in `http` module. `http.createServer((req, res) => {})` creates a server that listens for requests. You manually parse the URL for routing, read the request body from the stream, set status codes and headers, and send JSON with `res.end(JSON.stringify(data))`. Frameworks like Express wrap this — understanding plain Node HTTP explains what Express does under the hood.",
    frontendAnalogy:
      "Express is to plain Node HTTP what React is to plain DOM manipulation — a layer that handles the boilerplate. Knowing plain HTTP helps you debug Express and understand middleware, routing, and body parsing at a deeper level.",
    backendPerspective:
      "Create a server with `createServer`, listen on a port. Route by checking `req.method` and `new URL(req.url).pathname`. Read POST body by collecting stream chunks: `const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => { const body = JSON.parse(Buffer.concat(chunks)); })`. Set headers before `res.end()`. In production use Express/Fastify — but know this foundation.",
    keyPoints: [
      "`http.createServer(callback)` — callback receives `(req, res)` for every request.",
      "Routing — check `req.method` + parsed `url.pathname` to dispatch to handlers.",
      "Request body — collect stream chunks on POST/PUT; parse JSON in the 'end' event.",
      "`res.writeHead(status, headers)` + `res.end(body)` — send the response.",
      "Express/Fastify abstract all of this — use them in production, learn plain http for understanding.",
    ],
    example: {
      title: "Plain Node HTTP server with routing and JSON",
      language: "typescript",
      code: `import { createServer } from 'node:http';

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', \`http://\${req.headers.host}\`);

  // Route: GET /api/users
  if (req.method === 'GET' && url.pathname === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Alex' }]));
    return;
  }

  // Route: POST /api/users — read body
  if (req.method === 'POST' && url.pathname === '/api/users') {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const body = JSON.parse(Buffer.concat(chunks).toString());

    const newUser = { id: 2, ...body };
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000, () => console.log('http://localhost:3000'));`,
    },
    quiz: {
      question: "In plain Node HTTP, how do you send a JSON response?",
      options: [
        "res.json(data) — same as Express",
        "res.writeHead(200, {'Content-Type': 'application/json'}) then res.end(JSON.stringify(data))",
        "return data from the callback",
        "console.log(data)",
      ],
      correctIndex: 1,
      explanation:
        "Plain Node has no res.json(). You set Content-Type header and end the response with a JSON string.",
    },
  },
  {
    id: "node-fetch",
    title: "Fetch & AbortController in Node",
    phase: NODEJS_PHASE,
    summary:
      "Node 18+ includes the global `fetch()` API — the same interface you use in the browser. Call external APIs (Stripe, SendGrid, other microservices) with `await fetch(url, options)`. `AbortController` lets you cancel a request after a timeout or when a user navigates away — pass `signal: controller.signal` and call `controller.abort()` to cancel.",
    frontendAnalogy:
      "Identical to browser fetch — same API, same options, same Response object. Your frontend `fetch('/api/users')` and backend `fetch('https://api.stripe.com/v1/charges')` use the same function. AbortController works the same way for canceling in-flight requests.",
    backendPerspective:
      "Use fetch in services to call external APIs. Always set timeouts with AbortController — external APIs can hang. Check `res.ok` before parsing JSON; handle non-2xx responses explicitly. Set headers: `Authorization`, `Content-Type`. For production HTTP clients with retries and connection pooling, some teams prefer `axios` or `got` — but native fetch is sufficient for most cases in Node 20+.",
    keyPoints: [
      "`fetch(url, { method, headers, body })` — global in Node 18+; returns a Promise<Response>.",
      "`await res.json()` — parse JSON body; check `res.ok` or `res.status` first.",
      "`AbortController` — `const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal })`.",
      "Timeout pattern — `setTimeout(() => ctrl.abort(), 5000)` for 5s timeout.",
      "Always handle errors — network failures throw; non-2xx responses don't throw by default.",
    ],
    example: {
      title: "Calling an external API with timeout",
      language: "typescript",
      code: `async function callExternalApi(endpoint: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const res = await fetch(\`https://api.example.com\${endpoint}\`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.API_KEY}\`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(\`API error: \${res.status} \${res.statusText}\`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out after 5 seconds');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// Usage in a service
const user = await callExternalApi('/users/42');`,
    },
    quiz: {
      question: "How do you cancel a fetch request after 3 seconds in Node?",
      options: [
        "Call fetch.cancel()",
        "Use AbortController: setTimeout(() => controller.abort(), 3000) with signal in fetch options",
        "Close the server",
        "fetch cannot be cancelled in Node",
      ],
      correctIndex: 1,
      explanation:
        "AbortController.abort() cancels the fetch. Pass signal: controller.signal in fetch options.",
    },
  },
  {
    id: "node-runtime",
    title: "Node.js Runtime Internals",
    phase: NODEJS_PHASE,
    summary:
      "Node.js has three key layers: your JavaScript code, the V8 engine (compiles and runs JS), and libuv (handles async I/O — file system, network, timers). JavaScript itself is single-threaded, but libuv uses a thread pool and the OS event notification system so I/O doesn't block. The event loop is the cycle that processes callbacks, timers, and I/O completions — understanding it explains why blocking code freezes your entire server.",
    frontendAnalogy:
      "The browser has a similar event loop — that's why `await fetch()` doesn't freeze the UI. Node's event loop is the same idea but on the server: one thread runs your JS, while I/O happens in the background and callbacks queue up when ready.",
    backendPerspective:
      "Never run CPU-heavy sync code (big loops, image processing, JSON.parse of huge files) on the main thread — it blocks all requests. Offload CPU work to worker threads (`worker_threads` module) or a job queue. I/O (DB queries, file reads, HTTP calls) is non-blocking via libuv. `process.nextTick` runs before I/O callbacks; `setImmediate` runs after. Use `clinic.js` or `--inspect` to diagnose event loop lag.",
    keyPoints: [
      "V8 — Google's JS engine; compiles and executes your JavaScript code.",
      "libuv — C library providing the event loop, thread pool, and async I/O (fs, net, dns).",
      "Event loop phases — timers → pending callbacks → poll (I/O) → check (setImmediate) → close.",
      "Blocking vs non-blocking — sync fs/crypto blocks the loop; async versions delegate to libuv.",
      "Single-threaded JS — one thread runs your code; use worker_threads or cluster for CPU parallelism.",
    ],
    terminology: [
      {
        term: "Event loop",
        definition:
          "The cycle that picks callbacks from queues and runs them. Enables non-blocking I/O in single-threaded Node.",
      },
      {
        term: "libuv",
        definition:
          "C library powering Node's async I/O. Manages the thread pool (default 4 threads) for file/crypto operations.",
      },
      {
        term: "Blocking the event loop",
        definition:
          "Running synchronous CPU-heavy code that prevents any other callbacks from executing. Freezes all requests.",
      },
    ],
    example: {
      title: "Blocking vs non-blocking",
      language: "typescript",
      code: `// ❌ BLOCKING — freezes ALL requests for 3 seconds
app.get('/bad', (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 3000) {} // busy-wait!
  res.send('done');
});

// ✅ NON-BLOCKING I/O — other requests handled while waiting
app.get('/good', async (req, res) => {
  const users = await db.users.findAll(); // libuv handles I/O
  res.json(users);
});

// ❌ BLOCKING I/O — readFileSync blocks the thread
import { readFileSync } from 'node:fs';
const data = readFileSync('big-file.json'); // ALL requests wait

// ✅ NON-BLOCKING I/O
import { readFile } from 'node:fs/promises';
const data = await readFile('big-file.json'); // other requests proceed

// CPU-heavy work → worker thread or job queue, not main thread`,
    },
    quiz: {
      question: "What happens if you run a 5-second while loop in an Express handler?",
      options: [
        "Only that request is slow",
        "The entire server freezes — no other requests are processed for 5 seconds",
        "Node spawns a new thread automatically",
        "libuv handles it in the background",
      ],
      correctIndex: 1,
      explanation:
        "JavaScript runs on a single thread. A sync loop blocks the event loop, freezing all concurrent requests.",
    },
  },
  {
    id: "node-cluster",
    title: "The Cluster Module",
    phase: NODEJS_PHASE,
    summary:
      "Node runs JavaScript on a single thread — one CPU core per process. The `cluster` module spawns multiple worker processes that share the same port, each handling requests independently. This uses all CPU cores on a multi-core machine. The primary process manages workers; if a worker crashes, the primary can restart it. In production, process managers (PM2) or containers (Kubernetes) often replace manual cluster setup.",
    frontendAnalogy:
      "Like opening multiple tabs of your app — each worker is an independent copy of your server process, all listening on the same port. The OS (or primary process) distributes incoming connections across workers, similar to how a load balancer distributes traffic across servers.",
    backendPerspective:
      "Use `cluster.isPrimary` to fork workers in the primary process; workers run your Express app. Node handles port sharing automatically. Rule of thumb: one worker per CPU core. In cloud deployments, Kubernetes replicas or PM2 replace manual cluster — each pod/process is a separate Node instance behind a load balancer. Cluster is most useful on a single beefy server without container orchestration.",
    keyPoints: [
      "`cluster.fork()` — primary spawns a worker process; workers run your server code.",
      "All workers share the same port — OS distributes connections across them.",
      "Crash recovery — primary can listen for worker 'exit' and fork a replacement.",
      "One worker per CPU core — `os.cpus().length` tells you how many cores to use.",
      "In containers/K8s — prefer multiple pods over cluster module; each pod is one process.",
    ],
    example: {
      title: "Cluster module setup",
      language: "typescript",
      code: `import cluster from 'node:cluster';
import os from 'node:os';
import { createServer } from 'node:http';

const NUM_WORKERS = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} — forking \${NUM_WORKERS} workers\`);

  for (let i = 0; i < NUM_WORKERS; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died — restarting\`);
    cluster.fork();
  });
} else {
  // Workers run the actual server
  createServer((req, res) => {
    res.end(\`Handled by worker \${process.pid}\\n\`);
  }).listen(3000);

  console.log(\`Worker \${process.pid} started\`);
}`,
    },
    quiz: {
      question: "When should you use the cluster module vs Kubernetes replicas?",
      options: [
        "Always use cluster in production",
        "Cluster on a single multi-core server; K8s replicas when running in containers across machines",
        "Kubernetes cannot run Node.js",
        "Cluster is only for development",
      ],
      correctIndex: 1,
      explanation:
        "Cluster uses all cores on one machine. In K8s, each pod is typically one Node process — scale by adding pods.",
    },
  },
];

export { NODEJS_PHASE, nodejsConcepts };
