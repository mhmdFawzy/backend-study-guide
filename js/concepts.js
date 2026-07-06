const PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1";

const PHASES = [
  "Foundations",
  "Security & Pipeline",
  "Application Layer",
  "Data & Performance",
  "Operations & Advanced",
];

const backendConcepts = [
  {
    id: "http",
    title: "HTTP Protocol",
    phase: "Foundations",
    summary:
      "HTTP is how your browser (client) talks to a server. Every API call is an HTTP request with a method, URL, headers, and optional body. The server replies with a status code, headers, and a body.",
    frontendAnalogy:
      "Like `fetch('/api/users')` — you send a request object and get back a Response. Backend engineers design what that endpoint accepts and returns.",
    keyPoints: [
      "GET reads data, POST creates, PUT/PATCH updates, DELETE removes",
      "Status codes: 2xx success, 4xx client error, 5xx server error",
      "Headers carry metadata (auth tokens, content type, caching rules)",
      "HTTPS encrypts the connection with TLS",
    ],
    example: {
      title: "A typical GET request and 200 response",
      language: "http",
      code: `// Client request
GET /api/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOi...
Accept: application/json

// Server response
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 42, "name": "Alex", "email": "alex@example.com"}`,
    },
    quiz: {
      question: "Which HTTP method should create a new user?",
      options: ["GET", "POST", "DELETE", "PATCH"],
      correctIndex: 1,
      explanation: "POST is used to create new resources. GET only reads data.",
    },
    playlistNote: "Video 2 in the playlist",
  },
  {
    id: "servers",
    title: "Servers",
    phase: "Foundations",
    summary:
      "A server is a computer (physical or virtual) that runs your backend code 24/7 and responds to HTTP requests. When you call an API, a server receives the request, runs your handler, and sends back a response.",
    frontendAnalogy:
      "Like a restaurant that's always open — staff (your backend code) wait for orders (HTTP requests) even when no customers are there. Your React app is the customer placing orders.",
    keyPoints: [
      "Servers listen on a port (e.g. 3000, 8080) for incoming requests",
      "Can be a single machine or many behind a load balancer",
      "You pay for uptime — the server runs even when idle",
      "Production servers need monitoring, updates, and security patches",
    ],
    example: {
      title: "A minimal Node.js HTTP server",
      language: "javascript",
      code: `import http from 'http';

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

// Server stays running, waiting for requests
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});`,
    },
    quiz: {
      question: "Why does a traditional server run 24/7?",
      options: [
        "Browsers require it",
        "It must always be ready to accept incoming HTTP requests",
        "Databases only work at night",
        "It prevents caching",
      ],
      correctIndex: 1,
      explanation:
        "A server listens continuously so clients can connect anytime. Idle time still costs money because the process stays running.",
    },
  },
  {
    id: "routing",
    title: "Routing",
    phase: "Foundations",
    summary:
      "Routing maps a URL + HTTP method to the code that handles it. Path params (`/users/:id`) and query params (`?page=2`) extract data from the URL.",
    frontendAnalogy:
      "Like React Router — a URL path decides which component (handler) renders. On the backend, the path decides which function runs.",
    keyPoints: [
      "Static routes: `/health` always hits the same handler",
      "Dynamic routes: `/users/:id` captures `id` from the URL",
      "Query strings filter/sort: `/users?role=admin&page=2`",
      "Route groups help organize APIs: `/api/v1/users`",
    ],
    example: {
      title: "Express-style route definitions",
      language: "javascript",
      code: `// List all users
app.get('/api/users', listUsers);

// Get one user — :id is a path parameter
app.get('/api/users/:id', getUser);

// Create user — body parsed as JSON
app.post('/api/users', createUser);

// Query param example: GET /api/users?role=admin
// Inside handler: req.query.role === 'admin'`,
    },
    quiz: {
      question: "In `/api/users/:id`, what is `:id`?",
      options: [
        "A query parameter",
        "A path parameter",
        "An HTTP header",
        "A request body field",
      ],
      correctIndex: 1,
      explanation:
        "Path parameters are part of the URL path. Query parameters come after `?`.",
    },
  },
  {
    id: "serialization",
    title: "Serialization & Deserialization",
    phase: "Foundations",
    summary:
      "Serialization converts your app's data (objects) into a wire format (usually JSON) to send over the network. Deserialization converts incoming JSON back into native types.",
    frontendAnalogy:
      "You already do this with `JSON.stringify()` before sending and `response.json()` when receiving. Backend does the same on the server side.",
    keyPoints: [
      "JSON is the most common text format for REST APIs",
      "Binary formats (Protobuf) are faster but not human-readable",
      "Always validate data after deserializing — never trust the client",
      "Watch out for dates, nulls, and extra/missing fields",
    ],
    example: {
      title: "Serialize on send, deserialize on receive",
      language: "typescript",
      code: `// Frontend (you know this!)
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Sam', email: 'sam@test.com' }),
});
const user = await res.json(); // deserialize

// Backend handler (Node/Express)
app.post('/api/users', (req, res) => {
  const { name, email } = req.body; // already deserialized
  const newUser = { id: 1, name, email };
  res.status(201).json(newUser); // serialize to JSON
});`,
    },
    quiz: {
      question: "What does `res.json({ id: 1 })` do on the server?",
      options: [
        "Saves to the database",
        "Serializes the object to JSON and sends it",
        "Validates the request",
        "Creates an HTTP route",
      ],
      correctIndex: 1,
      explanation:
        "`.json()` serializes the JavaScript object to a JSON string in the response body.",
    },
  },
  {
    id: "auth",
    title: "Authentication & Authorization",
    phase: "Security & Pipeline",
    summary:
      "Authentication (authn) verifies WHO you are (login). Authorization (authz) verifies WHAT you're allowed to do (permissions). They are different steps.",
    frontendAnalogy:
      "Logging in with Google OAuth is authentication. Checking if you can access the admin dashboard is authorization — your app already does both on the frontend; the backend must enforce authz again.",
    keyPoints: [
      "Never trust the frontend — always verify tokens on the server",
      "JWT: stateless token with encoded user info + signature",
      "Sessions: server stores state, client holds a session cookie",
      "OAuth lets users log in via Google/GitHub without sharing passwords",
    ],
    example: {
      title: "JWT flow (simplified)",
      language: "typescript",
      code: `// 1. User logs in
POST /auth/login  { email, password }
→ Server checks password hash
→ Returns: { token: "eyJhbGci..." }

// 2. Frontend stores token, sends on every request
GET /api/admin/users
Authorization: Bearer eyJhbGci...

// 3. Backend middleware verifies token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyJwt(token); // throws if invalid
  req.user = user;
  next();
}`,
    },
    quiz: {
      question: "Checking if a user is an admin is...",
      options: [
        "Authentication",
        "Authorization",
        "Serialization",
        "Routing",
      ],
      correctIndex: 1,
      explanation:
        "Authentication proves identity. Authorization checks permissions (e.g. admin role).",
    },
  },
  {
    id: "validation",
    title: "Validation & Transformation",
    phase: "Security & Pipeline",
    summary:
      "Validation checks that incoming data is correct (type, format, business rules). Transformation converts data into the shape your app needs (string → number, trim whitespace).",
    frontendAnalogy:
      "Like Zod schemas in your React forms — but the backend MUST validate too. Client validation is for UX; server validation is for security.",
    keyPoints: [
      "Syntactic: is this a valid email format?",
      "Semantic: can date of birth be in the future? No.",
      "Transform: query param `?page=2` arrives as string \"2\", convert to number",
      "Sanitize: strip HTML to prevent injection attacks",
    ],
    example: {
      title: "Validation with Zod (backend)",
      language: "typescript",
      code: `import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.coerce.number().min(1).max(120),
});

app.post('/api/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  const user = createUser(result.data); // safe to use
  res.status(201).json(user);
});`,
    },
    quiz: {
      question: "Why validate on the server if the frontend already validates?",
      options: [
        "Server validation is faster",
        "Anyone can call your API directly, bypassing the UI",
        "Browsers require it",
        "It replaces the database",
      ],
      correctIndex: 1,
      explanation:
        "Attackers can send requests with curl or Postman. Server validation is the real security gate.",
    },
  },
  {
    id: "middleware",
    title: "Middleware",
    phase: "Security & Pipeline",
    summary:
      "Middleware are functions that run between receiving a request and reaching your handler. They form a pipeline: logging → auth → validation → handler → response.",
    frontendAnalogy:
      "Think of middleware like a chain of React context providers or Next.js middleware — each layer can inspect, modify, or block the request before it reaches your page (handler).",
    keyPoints: [
      "Each middleware calls `next()` to pass control forward",
      "Order matters: auth before route handler, error handler last",
      "Common uses: logging, CORS, rate limiting, auth, body parsing",
      "Middleware can end the request early (e.g. return 401)",
    ],
    example: {
      title: "Middleware pipeline",
      language: "javascript",
      code: `// Order matters!
app.use(logger);        // 1. Log every request
app.use(cors());        // 2. Add CORS headers
app.use(express.json()); // 3. Parse JSON body
app.use(authMiddleware); // 4. Check JWT

app.get('/api/profile', (req, res) => {
  // req.user was set by authMiddleware
  res.json(req.user);
});

app.use(errorHandler);  // 5. Catch all errors (last!)`,
    },
    quiz: {
      question: "Where should authentication middleware run?",
      options: [
        "After the route handler",
        "Before the route handler",
        "Only in the database layer",
        "Only on GET requests",
      ],
      correctIndex: 1,
      explanation:
        "Auth must run before your handler so unauthorized requests never reach business logic.",
    },
  },
  {
    id: "request-context",
    title: "Request Context",
    phase: "Security & Pipeline",
    summary:
      "Request context is temporary data that lives only for one request — user info, request ID, permissions. It's passed from middleware through handlers to services.",
    frontendAnalogy:
      "Like React Context or passing props down a component tree — but scoped to a single request lifecycle, then discarded.",
    keyPoints: [
      "Stores: user, request ID, trace ID, permissions",
      "Created at request start, destroyed when response is sent",
      "Avoids passing the same params through every function",
      "Don't store large objects — causes memory leaks",
    ],
    example: {
      title: "Attaching user to request context",
      language: "typescript",
      code: `// Middleware injects user into context
function authMiddleware(req, res, next) {
  const user = verifyToken(req.headers.authorization);
  req.context = {
    user,
    requestId: crypto.randomUUID(),
    startTime: Date.now(),
  };
  next();
}

// Handler reads from context — no need to re-verify token
function getOrders(req, res) {
  const { user, requestId } = req.context;
  logger.info('Fetching orders', { requestId, userId: user.id });
  const orders = orderService.findByUser(user.id);
  res.json(orders);
}`,
    },
    quiz: {
      question: "Request context data lives for...",
      options: [
        "The entire server lifetime",
        "One request only",
        "Until the user logs out",
        "24 hours",
      ],
      correctIndex: 1,
      explanation:
        "Context is request-scoped. It's created when a request arrives and cleaned up when the response is sent.",
    },
  },
  {
    id: "handlers",
    title: "Handlers, Controllers & Services",
    phase: "Application Layer",
    summary:
      "Handlers/controllers handle HTTP (parse request, send response). Services contain business logic. This separation keeps HTTP concerns separate from domain logic.",
    frontendAnalogy:
      "Controller = your page component (handles UI events). Service = custom hook or API utility (business logic). Keep pages thin, logic in hooks.",
    keyPoints: [
      "Controller: thin — parse input, call service, format response",
      "Service: fat — business rules, calculations, orchestration",
      "Same service can be used by REST API, CLI, or background jobs",
      "MVC: Model (data), View (response), Controller (HTTP layer)",
    ],
    example: {
      title: "Thin controller, fat service",
      language: "typescript",
      code: `// Controller — only HTTP concerns
async function createOrder(req, res) {
  try {
    const order = await orderService.create(req.context.user.id, req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Service — business logic
class OrderService {
  async create(userId: string, items: CartItem[]) {
    if (items.length === 0) throw new Error('Cart is empty');
    const total = this.calculateTotal(items);
    if (total > await walletService.getBalance(userId)) {
      throw new Error('Insufficient funds');
    }
    return db.orders.insert({ userId, items, total });
  }
}`,
    },
    quiz: {
      question: "Where should 'check if user has enough balance' live?",
      options: ["Controller", "Service", "Middleware", "Router"],
      correctIndex: 1,
      explanation:
        "Business rules belong in the service layer. Controllers should only handle HTTP input/output.",
    },
  },
  {
    id: "crud",
    title: "CRUD Operations",
    phase: "Application Layer",
    summary:
      "CRUD = Create, Read, Update, Delete. These map to HTTP methods and are the foundation of most APIs you'll build.",
    frontendAnalogy:
      "Your React Query hooks (`useUsers`, `useCreateUser`) map directly to CRUD endpoints. Backend implements what those hooks call.",
    keyPoints: [
      "Create → POST (returns 201 Created)",
      "Read one → GET /items/:id (200 OK)",
      "Read many → GET /items?page=1&limit=20 (200 OK)",
      "Update → PUT/PATCH (200 OK), Delete → DELETE (204 No Content)",
    ],
    example: {
      title: "CRUD endpoints for a Todo app",
      language: "http",
      code: `POST   /api/todos          → Create  (201 + new todo)
GET    /api/todos          → List    (200 + array)
GET    /api/todos/:id      → Read    (200 or 404)
PATCH  /api/todos/:id      → Update  (200 + updated todo)
DELETE /api/todos/:id      → Delete  (204 no body)

// List with pagination & filter
GET /api/todos?completed=false&page=2&limit=10`,
    },
    quiz: {
      question: "What status code should a successful DELETE return?",
      options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
      correctIndex: 2,
      explanation:
        "204 No Content is standard for successful deletes with no response body. 200 is also acceptable if you return the deleted item.",
    },
  },
  {
    id: "rest",
    title: "RESTful Architecture",
    phase: "Application Layer",
    summary:
      "REST designs APIs around resources (nouns), not actions (verbs). Use HTTP methods for actions. URLs represent things: `/users`, `/orders`, not `/getUsers`.",
    frontendAnalogy:
      "Instead of `POST /createUser`, REST says `POST /users`. The method + resource name tells the server what to do — predictable for frontend devs.",
    keyPoints: [
      "Resources are nouns: `/users`, `/products`, `/orders`",
      "Use HTTP semantics — don't use GET to delete",
      "Version APIs: `/api/v1/users` or via headers",
      "Consistent response shapes help frontend code stay clean",
    ],
    example: {
      title: "RESTful vs non-RESTful",
      language: "http",
      code: `// ✅ RESTful — resource-oriented
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/42/orders

// ❌ Non-RESTful — action-oriented (RPC style)
GET    /api/getAllUsers
POST   /api/createUser
POST   /api/deleteUser/42

// Consistent error response shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "fields": { "email": "Required" }
  }
}`,
    },
    quiz: {
      question: "Which URL is RESTful?",
      options: [
        "POST /api/deleteUser",
        "GET /api/getUserById/42",
        "DELETE /api/users/42",
        "POST /api/users/remove",
      ],
      correctIndex: 2,
      explanation:
        "DELETE /api/users/42 uses the HTTP method for the action and a resource URL.",
    },
  },
  {
    id: "databases",
    title: "Databases",
    phase: "Application Layer",
    summary:
      "Databases persist data. SQL (PostgreSQL, MySQL) uses tables and relationships. NoSQL (MongoDB, Redis) uses flexible documents or key-value stores. Choose based on your data shape and query needs.",
    frontendAnalogy:
      "Like `localStorage` but shared, reliable, and queryable by the whole server. Your frontend fetches from APIs; APIs read/write the database.",
    keyPoints: [
      "SQL: structured data, joins, ACID transactions",
      "NoSQL: flexible schemas, horizontal scaling",
      "Indexes speed up reads (like an index in a book)",
      "Migrations version-control your schema changes",
    ],
    example: {
      title: "SQL query vs ORM (Prisma)",
      language: "sql",
      code: `-- Raw SQL
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.id;

-- ORM equivalent (Prisma) — generates SQL for you
const users = await prisma.user.findMany({
  where: { active: true },
  include: { _count: { select: { orders: true } } },
});`,
    },
    quiz: {
      question: "What does an index on a database column do?",
      options: [
        "Encrypts the data",
        "Speeds up read queries on that column",
        "Deletes old rows automatically",
        "Validates input data",
      ],
      correctIndex: 1,
      explanation:
        "Indexes are lookup structures that make finding rows by that column much faster.",
    },
  },
  {
    id: "bll",
    title: "Business Logic Layer",
    phase: "Application Layer",
    summary:
      "The BLL sits between your HTTP layer and database. It enforces business rules: pricing, permissions, workflows. Never put business rules in controllers or directly in SQL.",
    frontendAnalogy:
      "Like keeping API calls and business rules in custom hooks instead of inline in JSX. The UI (controller) stays dumb; the hook (service) is smart.",
    keyPoints: [
      "Presentation layer: HTTP, validation, response formatting",
      "Business logic layer: rules, calculations, workflows",
      "Data access layer: database queries only",
      "Separation makes code testable and reusable",
    ],
    example: {
      title: "Three-layer architecture",
      language: "text",
      code: `Request flow:

  HTTP Request
       ↓
  [Presentation]  Controller + Middleware + Validation
       ↓
  [Business Logic]  OrderService.calculateDiscount()
                    UserService.canAccessResource()
       ↓
  [Data Access]   UserRepository.findById()
                  OrderRepository.save()
       ↓
  Database`,
    },
    quiz: {
      question: "Calculating a 10% discount belongs in...",
      options: [
        "The database",
        "The controller",
        "The business logic layer",
        "The HTTP router",
      ],
      correctIndex: 2,
      explanation:
        "Pricing rules are business logic. They belong in services, not controllers or SQL.",
    },
  },
  {
    id: "caching",
    title: "Caching",
    phase: "Data & Performance",
    summary:
      "Caching stores frequently accessed data in fast memory (Redis, in-memory) so you don't hit the database every time. Trade-off: speed vs freshness.",
    frontendAnalogy:
      "Like React Query's cache — it stores API results so you don't refetch on every render. Backend caching does the same at the server level.",
    keyPoints: [
      "Cache-aside: check cache first, on miss fetch DB and store",
      "TTL (time-to-live): auto-expire stale data",
      "Invalidate cache when underlying data changes",
      "HTTP caching: `Cache-Control` headers for browser/CDN",
    ],
    example: {
      title: "Cache-aside pattern with Redis",
      language: "typescript",
      code: `async function getUser(id: string) {
  const cacheKey = \`user:\${id}\`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // cache hit ⚡

  // 2. Cache miss — fetch from DB
  const user = await db.users.findById(id);
  if (!user) return null;

  // 3. Store in cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(user));
  return user;
}`,
    },
    quiz: {
      question: "What is a 'cache miss'?",
      options: [
        "The cache server crashed",
        "Data wasn't in cache, so we fetch from the source",
        "The user entered wrong credentials",
        "The HTTP request failed",
      ],
      correctIndex: 1,
      explanation:
        "A cache miss means the data wasn't cached yet, so you fall back to the slower source (usually the database).",
    },
  },
  {
    id: "queues",
    title: "Task Queues & Scheduling",
    phase: "Data & Performance",
    summary:
      "Don't make users wait for slow work (sending emails, processing images). Push jobs to a queue; a worker processes them in the background. Scheduling runs jobs at specific times.",
    frontendAnalogy:
      "Like firing-and-forgetting a mutation while showing optimistic UI — the user gets an instant response; heavy work happens behind the scenes.",
    keyPoints: [
      "Producer adds jobs, consumer/worker processes them",
      "Retries handle transient failures automatically",
      "Use for: emails, image processing, report generation",
      "Cron/schedulers run recurring jobs (backups, cleanup)",
    ],
    example: {
      title: "Enqueue email instead of blocking the request",
      language: "typescript",
      code: `// ❌ Bad — user waits 3 seconds for email to send
app.post('/api/signup', async (req, res) => {
  const user = await createUser(req.body);
  await sendWelcomeEmail(user.email); // blocks!
  res.json(user);
});

// ✅ Good — respond immediately, email sent in background
app.post('/api/signup', async (req, res) => {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { email: user.email });
  res.status(201).json(user); // instant response
});`,
    },
    quiz: {
      question: "When should you use a background job queue?",
      options: [
        "For every API request",
        "For slow tasks that don't need to block the response",
        "Instead of a database",
        "Only for authentication",
      ],
      correctIndex: 1,
      explanation:
        "Queues offload slow, non-critical work so API responses stay fast.",
    },
  },
  {
    id: "errors",
    title: "Error Handling",
    phase: "Data & Performance",
    summary:
      "Errors happen. Good backends catch them gracefully, return consistent error shapes, log details server-side, and show safe messages to clients.",
    frontendAnalogy:
      "Like your error boundaries and toast notifications — but the backend must never leak stack traces or internal details to the client.",
    keyPoints: [
      "Use consistent error response format across all endpoints",
      "Log full details server-side (Sentry, etc.)",
      "Return safe messages to clients ('Invalid credentials', not 'User not found')",
      "Global error handler catches unhandled exceptions",
    ],
    example: {
      title: "Global error handler",
      language: "typescript",
      code: `// Custom error types
class NotFoundError extends Error {
  statusCode = 404;
}

// Global handler (Express)
app.use((err, req, res, next) => {
  logger.error(err, { requestId: req.context?.requestId });

  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status < 500 ? err.message : 'Something went wrong',
    },
  });
});`,
    },
    quiz: {
      question: "Should you return database error details to the client?",
      options: [
        "Yes, always — helps debugging",
        "No — log internally, return a generic message",
        "Only in production",
        "Only for admin users",
      ],
      correctIndex: 1,
      explanation:
        "Internal errors can reveal schema info or security holes. Log details server-side only.",
    },
  },
  {
    id: "logging",
    title: "Logging & Observability",
    phase: "Operations & Advanced",
    summary:
      "Logs record what happened. Metrics measure how the system performs. Traces follow a request across services. Together they help you debug production issues.",
    frontendAnalogy:
      "Like `console.log` in dev, but structured, centralized, and searchable in production. Request IDs let you trace one user's journey through your system.",
    keyPoints: [
      "Structured logs (JSON) are searchable; plain text is not",
      "Levels: debug, info, warn, error",
      "Never log passwords, tokens, or PII",
      "Request/trace IDs connect logs across services",
    ],
    example: {
      title: "Structured logging",
      language: "typescript",
      code: `// ❌ Hard to search in production
console.log('User ' + userId + ' created order ' + orderId);

// ✅ Structured — searchable in Datadog/Grafana
logger.info('Order created', {
  requestId: req.context.requestId,
  userId,
  orderId,
  amount: order.total,
  duration_ms: Date.now() - req.context.startTime,
});`,
    },
    quiz: {
      question: "What should you NEVER log?",
      options: [
        "Request IDs",
        "User IDs",
        "Passwords and API keys",
        "Response times",
      ],
      correctIndex: 2,
      explanation:
        "Secrets in logs are a security risk. Logs are often stored in third-party services.",
    },
  },
  {
    id: "security",
    title: "Security",
    phase: "Operations & Advanced",
    summary:
      "Backend security protects data and systems: validate all input, use HTTPS, rate limit, hash passwords, prevent injection attacks, and follow least-privilege access.",
    frontendAnalogy:
      "You sanitize user input in React to prevent XSS. The backend must do the same and more — SQL injection, CSRF, and broken auth are server-side problems too.",
    keyPoints: [
      "Hash passwords (bcrypt/argon2) — never store plain text",
      "Parameterized queries prevent SQL injection",
      "Rate limiting stops brute-force attacks",
      "CORS controls which frontends can call your API",
    ],
    example: {
      title: "SQL injection prevention",
      language: "typescript",
      code: `// ❌ Vulnerable — user input in raw SQL
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
// Attacker sends: email = "' OR '1'='1" → returns ALL users

// ✅ Safe — parameterized query
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email] // driver escapes this safely
);`,
    },
    quiz: {
      question: "How should passwords be stored?",
      options: [
        "Plain text in the database",
        "Encrypted with a reversible key",
        "Hashed with bcrypt/argon2",
        "In the JWT token",
      ],
      correctIndex: 2,
      explanation:
        "Hashing is one-way. Even if the DB leaks, passwords can't be recovered.",
    },
  },
  {
    id: "scaling",
    title: "Scaling & Performance",
    phase: "Operations & Advanced",
    summary:
      "Scaling means handling more traffic. Vertical = bigger server. Horizontal = more servers behind a load balancer. Optimize bottlenecks before scaling.",
    frontendAnalogy:
      "Like code-splitting and lazy loading — don't load everything at once. Backend equivalent: cache hot data, paginate large lists, offload slow work to queues.",
    keyPoints: [
      "Find bottlenecks first (DB queries, N+1 problems)",
      "Horizontal scaling: multiple app instances + load balancer",
      "Database read replicas for read-heavy apps",
      "Pagination and compression reduce payload size",
    ],
    example: {
      title: "N+1 query problem",
      language: "typescript",
      code: `// ❌ N+1 — 1 query for users + N queries for each user's orders
const users = await db.users.findAll();
for (const user of users) {
  user.orders = await db.orders.findByUserId(user.id); // N queries!
}

// ✅ Fixed — 2 queries with a join or eager load
const users = await db.users.findAll({
  include: { orders: true }, // single JOIN query
});`,
    },
    quiz: {
      question: "What is the N+1 query problem?",
      options: [
        "Running too many servers",
        "1 query for a list + N extra queries for related data",
        "A network timeout issue",
        "Caching too aggressively",
      ],
      correctIndex: 1,
      explanation:
        "Fetching a list then querying related data in a loop causes N+1 queries. Use joins or eager loading instead.",
    },
  },
  {
    id: "webhooks",
    title: "Webhooks",
    phase: "Operations & Advanced",
    summary:
      "Webhooks are server-to-server push notifications. Instead of polling 'is payment done?', Stripe calls YOUR endpoint when payment completes.",
    frontendAnalogy:
      "Opposite of polling. Like WebSockets pushing updates to your UI — but between servers. Your backend exposes an endpoint; external services POST events to it.",
    keyPoints: [
      "Event-driven: server pushes data when something happens",
      "Verify signatures to ensure requests are genuine",
      "Respond quickly (200 OK), process async if needed",
      "Implement retries and idempotency for reliability",
    ],
    example: {
      title: "Stripe payment webhook",
      language: "typescript",
      code: `app.post('/webhooks/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];

  // 1. Verify it's really from Stripe
  const event = stripe.webhooks.constructEvent(req.body, sig, SECRET);

  // 2. Handle event
  if (event.type === 'payment_intent.succeeded') {
    await orderService.markPaid(event.data.object.id);
  }

  // 3. Respond fast — Stripe retries on failure
  res.json({ received: true });
});`,
    },
    quiz: {
      question: "Webhooks are better than polling when...",
      options: [
        "You need real-time updates from external services",
        "You want to reduce server load by checking constantly",
        "Both A and B",
        "Neither — always use polling",
      ],
      correctIndex: 2,
      explanation:
        "Webhooks push events instantly and avoid wasteful repeated polling requests.",
    },
  },
  {
    id: "serverless",
    title: "Serverless",
    phase: "Operations & Advanced",
    summary:
      "Serverless means you write small functions and a cloud provider runs them only when triggered — then shuts them down. You don't manage a server; you pay per invocation instead of 24/7 uptime.",
    frontendAnalogy:
      "Like a food truck that only opens when you call — no staff sitting idle. Your static site on GitHub Pages is free because there's no always-on server; a serverless function can handle tasks the browser can't do alone.",
    keyPoints: [
      "Functions run on demand (HTTP request, cron, file upload, etc.)",
      "Auto-scales — provider spins up more instances under load",
      "Cold starts: first request after idle may be slower",
      "Good for: webhooks, image processing, API proxies — not long-running jobs",
    ],
    example: {
      title: "Serverless vs always-on server",
      language: "text",
      code: `# Traditional server
- Your Node app runs 24/7 on one machine
- You pay for the machine even at 3 AM with zero traffic
- You handle scaling, restarts, and OS updates

# Serverless function (e.g. Vercel, AWS Lambda)
- export default function handler(req) { return Response.json({ ok: true }); }
- Runs only when someone hits the endpoint
- Provider scales and manages infrastructure
- You pay per request + compute time`,
    },
    quiz: {
      question: "When is serverless a good fit?",
      options: [
        "Long-running background jobs that run for hours",
        "Sporadic tasks like webhooks or API proxies with variable traffic",
        "Apps that need a persistent WebSocket connection 24/7",
        "When you want full control over the operating system",
      ],
      correctIndex: 1,
      explanation:
        "Serverless shines for event-driven, bursty workloads. Long-running processes and persistent connections are better on traditional servers.",
    },
  },
  {
    id: "devops",
    title: "DevOps Basics",
    phase: "Operations & Advanced",
    summary:
      "DevOps bridges development and operations: CI/CD automates testing and deployment, Docker containers package your app, and infrastructure-as-code manages servers.",
    frontendAnalogy:
      "Like your GitHub Actions running lint + build on every PR — but extended to deploy the backend to production automatically after tests pass.",
    keyPoints: [
      "CI: auto-run tests on every commit",
      "CD: auto-deploy passing builds to staging/production",
      "Docker: consistent environment dev → prod",
      "Blue-green / rolling deploys reduce downtime",
    ],
    example: {
      title: "Simple CI/CD pipeline",
      language: "yaml",
      code: `# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test          # CI — catch bugs
      - run: docker build -t my-api .
      - run: docker push my-api:latest
      - run: kubectl rollout restart deployment/api  # CD — deploy`,
    },
    quiz: {
      question: "What does CI (Continuous Integration) do?",
      options: [
        "Deploys to production manually",
        "Automatically runs tests on every code change",
        "Manages database migrations only",
        "Replaces the need for code review",
      ],
      correctIndex: 1,
      explanation:
        "CI automatically builds and tests code when developers push changes, catching bugs early.",
    },
  },
  {
    id: "emails",
    title: "Transactional Emails",
    phase: "Data & Performance",
    summary:
      "Transactional emails are triggered by user actions (signup, password reset, order confirmation). They're not marketing blasts — they're expected, one-to-one messages.",
    frontendAnalogy:
      "After your signup form succeeds, the backend sends a welcome email. The frontend just shows 'Check your inbox' — the actual email sending happens server-side, often in a background job.",
    keyPoints: [
      "Use a service (SendGrid, Resend, AWS SES) — don't run your own mail server",
      "Send via queue so the API responds instantly",
      "Templates with dynamic variables: {{user.name}}, {{resetLink}}",
      "Handle bounces and unsubscribes for deliverability",
    ],
    example: {
      title: "Welcome email via queue",
      language: "typescript",
      code: `// After user signs up
await emailQueue.add('welcome', {
  to: user.email,
  template: 'welcome',
  vars: { name: user.name, loginUrl: 'https://app.com/login' },
});

// Worker sends via Resend/SendGrid
async function sendWelcomeEmail({ to, vars }) {
  await resend.emails.send({
    from: 'hello@yourapp.com',
    to,
    subject: \`Welcome, \${vars.name}!\`,
    html: renderTemplate('welcome', vars),
  });
}`,
    },
    quiz: {
      question: "Why send emails through a background queue?",
      options: [
        "Emails must be encrypted",
        "Email APIs are slow — don't block the HTTP response",
        "Browsers can't send emails",
        "Queues replace the need for templates",
      ],
      correctIndex: 1,
      explanation:
        "Email providers can take 1–3 seconds. Queuing keeps your signup API fast.",
    },
  },
  {
    id: "elasticsearch",
    title: "Elasticsearch & Search",
    phase: "Data & Performance",
    summary:
      "Elasticsearch is a search engine optimized for full-text search, filters, and analytics. Use it when SQL LIKE queries are too slow or too limited for search UX.",
    frontendAnalogy:
      "Like a fast autocomplete/typeahead on your site — Elasticsearch powers 'search as you type' by indexing text differently than a regular database.",
    keyPoints: [
      "Inverted index: maps words → documents (fast lookup)",
      "Great for: search bars, log analytics, filtering large datasets",
      "Not a replacement for your primary database",
      "Sync data from DB → Elasticsearch via events or batch jobs",
    ],
    example: {
      title: "Simple product search query",
      language: "json",
      code: `// Index a product (usually done on create/update)
PUT /products/_doc/42
{
  "name": "Wireless Keyboard",
  "description": "Ergonomic mechanical keyboard",
  "price": 79.99
}

// Search as user types "keyb"
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "keyb",
      "fields": ["name", "description"]
    }
  }
}`,
    },
    quiz: {
      question: "When should you use Elasticsearch over SQL search?",
      options: [
        "For all database queries",
        "For full-text search, autocomplete, and log analytics at scale",
        "Instead of Redis caching",
        "Only for user authentication",
      ],
      correctIndex: 1,
      explanation:
        "Elasticsearch excels at text search and analytics. Your primary DB still owns the source of truth.",
    },
  },
  {
    id: "config",
    title: "Config Management",
    phase: "Operations & Advanced",
    summary:
      "Config separates environment-specific settings (DB URLs, API keys, feature flags) from your code. Change config without redeploying code.",
    frontendAnalogy:
      "Like `.env.local` for your Next.js app — but on the server you also have staging vs production configs, secrets, and feature flags.",
    keyPoints: [
      "Never hardcode secrets in source code",
      "Use env vars: `process.env.DATABASE_URL`",
      "Different values per environment: dev, staging, prod",
      "Feature flags toggle features without deploying new code",
    ],
    example: {
      title: "Environment-based config",
      language: "typescript",
      code: `// config.ts — single source of truth
const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL!, // required in prod
  jwtSecret: process.env.JWT_SECRET!,
  features: {
    newCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
  },
};

// .env.production (never commit this!)
// DATABASE_URL=postgres://...
// JWT_SECRET=super-secret-key
// FEATURE_NEW_CHECKOUT=true`,
    },
    quiz: {
      question: "Where should database passwords live?",
      options: [
        "Hardcoded in your source files",
        "Environment variables or a secrets manager",
        "In the frontend bundle",
        "In a public GitHub repo",
      ],
      correctIndex: 1,
      explanation:
        "Secrets belong in environment variables (or Vault/AWS Secrets Manager), never in code.",
    },
  },
  {
    id: "shutdown",
    title: "Graceful Shutdown",
    phase: "Operations & Advanced",
    summary:
      "When a server restarts or scales down, graceful shutdown finishes in-flight requests, closes DB connections, then exits. Prevents dropped requests and corrupted data.",
    frontendAnalogy:
      "Like saving state before closing a tab — the server doesn't just die; it wraps up work first.",
    keyPoints: [
      "Stop accepting new requests on SIGTERM",
      "Wait for in-flight requests to complete (with a timeout)",
      "Close database pools and file handles",
      "Kubernetes sends SIGTERM before killing pods",
    ],
    example: {
      title: "Graceful shutdown in Node.js",
      language: "typescript",
      code: `const server = app.listen(3000);

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');

  server.close(() => console.log('No new connections'));

  // Wait for in-flight requests (max 30s)
  await drainConnections(30_000);

  await db.pool.end();   // close DB connections
  await redis.quit();    // close Redis

  process.exit(0);
});`,
    },
    quiz: {
      question: "What happens first during graceful shutdown?",
      options: [
        "Delete all data",
        "Stop accepting new requests",
        "Restart the database",
        "Send emails to all users",
      ],
      correctIndex: 1,
      explanation:
        "The server stops accepting new connections, then finishes existing ones before exiting.",
    },
  },
  {
    id: "concurrency",
    title: "Concurrency & Parallelism",
    phase: "Operations & Advanced",
    summary:
      "Concurrency handles many tasks at once (I/O-bound: API calls, DB queries). Parallelism runs tasks simultaneously on multiple CPU cores (CPU-bound: image processing, calculations).",
    frontendAnalogy:
      "Concurrency = handling many `fetch` calls without blocking the UI. Parallelism = Web Workers crunching data on multiple threads.",
    keyPoints: [
      "Node.js is single-threaded but concurrent via async I/O",
      "I/O-bound: use async/await, don't block the event loop",
      "CPU-bound: use worker threads or offload to a queue",
      "Go and Java handle parallelism with goroutines/threads natively",
    ],
    example: {
      title: "Concurrent I/O vs blocking",
      language: "typescript",
      code: `// ❌ Sequential — slow (3 seconds total)
const user = await fetchUser(id);
const orders = await fetchOrders(id);
const reviews = await fetchReviews(id);

// ✅ Concurrent — fast (~1 second total)
const [user, orders, reviews] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
  fetchReviews(id),
]);

// CPU-bound work → don't block the event loop
// Offload to a worker thread or background job queue`,
    },
    quiz: {
      question: "Promise.all() helps with...",
      options: [
        "CPU-heavy image processing in Node",
        "Running multiple I/O requests concurrently",
        "Replacing a database",
        "Encrypting passwords",
      ],
      correctIndex: 1,
      explanation:
        "Promise.all runs async I/O operations in parallel. CPU-heavy work needs worker threads or queues.",
    },
  },
  {
    id: "storage",
    title: "Object Storage & Large Files",
    phase: "Operations & Advanced",
    summary:
      "Object storage (AWS S3, Cloudflare R2) stores files like images, PDFs, and videos. APIs should not store large files in the database — upload directly to storage.",
    frontendAnalogy:
      "Like uploading a profile picture — the frontend often gets a presigned URL, uploads directly to S3, then tells your API the file URL. No huge files through your server.",
    keyPoints: [
      "Store files in S3/R2, store only the URL in your database",
      "Presigned URLs let clients upload directly to storage",
      "Stream large files instead of loading entirely into memory",
      "Multipart upload for files over 100MB",
    ],
    example: {
      title: "Presigned upload flow",
      language: "typescript",
      code: `// 1. Client asks for upload URL
POST /api/uploads/presign  { filename: "avatar.jpg", type: "image/jpeg" }

// 2. Server returns presigned S3 URL (expires in 5 min)
{ uploadUrl: "https://bucket.s3.../avatar.jpg?X-Amz-Signature=...",
  fileUrl: "https://cdn.example.com/avatar.jpg" }

// 3. Client uploads directly to S3 (bypasses your server!)
PUT uploadUrl  [binary file data]

// 4. Client saves fileUrl to user profile
PATCH /api/users/me  { avatarUrl: fileUrl }`,
    },
    quiz: {
      question: "Why use presigned URLs for file uploads?",
      options: [
        "They're more secure than HTTPS",
        "Large files skip your server — less load and faster uploads",
        "S3 can't accept direct uploads",
        "They replace the need for a database",
      ],
      correctIndex: 1,
      explanation:
        "Presigned URLs let clients upload directly to object storage, keeping your API lightweight.",
    },
  },
  {
    id: "realtime",
    title: "Real-time Systems",
    phase: "Operations & Advanced",
    summary:
      "Real-time backends push data to clients instantly using WebSockets or Server-Sent Events (SSE). Use when polling is too slow or wasteful.",
    frontendAnalogy:
      "You know WebSockets from chat apps and live notifications. SSE is simpler — one-way server → client, like a live feed.",
    keyPoints: [
      "WebSockets: two-way, persistent connection (chat, games)",
      "SSE: one-way server push (live feeds, notifications)",
      "Polling: client asks repeatedly — simple but wasteful",
      "Pub/Sub (Redis) coordinates messages across server instances",
    ],
    example: {
      title: "Server-Sent Events for live notifications",
      language: "typescript",
      code: `// Server — stream events to client
app.get('/api/notifications/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const send = (data) => res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);

  const sub = notificationBus.subscribe(req.user.id, send);
  req.on('close', () => sub.unsubscribe());
});

// Frontend
const source = new EventSource('/api/notifications/stream');
source.onmessage = (e) => showToast(JSON.parse(e.data));`,
    },
    quiz: {
      question: "WebSockets vs SSE — when is SSE enough?",
      options: [
        "When you need two-way chat",
        "When the server only needs to push updates to the client",
        "When you need to upload files",
        "SSE is never useful",
      ],
      correctIndex: 1,
      explanation:
        "SSE is simpler for one-way server→client streams. WebSockets are for two-way communication.",
    },
  },
  {
    id: "testing",
    title: "Testing & Code Quality",
    phase: "Operations & Advanced",
    summary:
      "Backend tests verify your API and business logic work correctly. Unit tests check individual functions; integration tests check the full request → database flow.",
    frontendAnalogy:
      "Like Jest/Vitest for React components — but testing API endpoints and services. Integration tests hit a real (test) database.",
    keyPoints: [
      "Unit tests: fast, test one function in isolation",
      "Integration tests: hit real endpoints + test DB",
      "E2E tests: full user flows across frontend + backend",
      "Run tests in CI before every deploy",
    ],
    example: {
      title: "API integration test",
      language: "typescript",
      code: `describe('POST /api/users', () => {
  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alex', email: 'alex@test.com' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('alex@test.com');

    // Verify it's actually in the database
    const user = await db.users.findByEmail('alex@test.com');
    expect(user).toBeTruthy();
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alex', email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});`,
    },
    quiz: {
      question: "What's the difference between unit and integration tests?",
      options: [
        "Unit tests are slower",
        "Unit tests isolate one function; integration tests test the full flow",
        "Integration tests don't use a database",
        "They're the same thing",
      ],
      correctIndex: 1,
      explanation:
        "Unit tests mock dependencies and test logic in isolation. Integration tests verify components work together.",
    },
  },
  {
    id: "twelve-factor",
    title: "The 12-Factor App",
    phase: "Operations & Advanced",
    summary:
      "12-Factor is a set of principles for building scalable, maintainable backend apps. Key ideas: one codebase, config in env vars, stateless processes, logs as streams.",
    frontendAnalogy:
      "Think of it as best practices for apps that deploy to the cloud — similar to how Next.js conventions guide frontend structure.",
    keyPoints: [
      "III. Config: store in environment, not code",
      "VI. Processes: stateless — store session in Redis/DB, not memory",
      "IX. Disposability: fast startup, graceful shutdown",
      "XII. Admin processes: run migrations as one-off tasks, not in app startup",
    ],
    example: {
      title: "Key 12-factor principles (simplified)",
      language: "text",
      code: `I.   One codebase, many deploys (dev/staging/prod)
III. Config in environment variables
IV.  Backing services as attached resources (DB, Redis)
VI.  Stateless processes (no in-memory sessions)
VIII.Scale horizontally via process model
IX.  Fast startup + graceful shutdown
XI.  Logs as event streams (stdout → aggregator)
XII. Migrations as one-off admin tasks`,
    },
    quiz: {
      question: "Why should backend processes be stateless?",
      options: [
        "Stateless apps are always faster",
        "So any server instance can handle any request (horizontal scaling)",
        "Databases don't support state",
        "It removes the need for authentication",
      ],
      correctIndex: 1,
      explanation:
        "Stateless servers can scale horizontally — a load balancer can send requests to any instance.",
    },
  },
  {
    id: "openapi",
    title: "OpenAPI Standards",
    phase: "Operations & Advanced",
    summary:
      "OpenAPI (formerly Swagger) is a standard for describing REST APIs. One spec file documents endpoints, request/response shapes, and can auto-generate docs and client SDKs.",
    frontendAnalogy:
      "Like TypeScript types for your API — but shared between frontend and backend. Tools generate fetch hooks from the spec automatically.",
    keyPoints: [
      "API-first: write the spec before coding endpoints",
      "Swagger UI renders interactive API docs from the spec",
      "Codegen generates TypeScript clients for your frontend",
      "Keeps frontend and backend in sync on contracts",
    ],
    example: {
      title: "OpenAPI spec snippet",
      language: "yaml",
      code: `openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
components:
  schemas:
    User:
      type: object
      properties:
        id: { type: integer }
        name: { type: string }
        email: { type: string, format: email }`,
    },
    quiz: {
      question: "What's the main benefit of OpenAPI for frontend devs?",
      options: [
        "It replaces the need for a backend",
        "Auto-generated types and API clients that stay in sync",
        "It makes APIs faster",
        "It handles authentication automatically",
      ],
      correctIndex: 1,
      explanation:
        "OpenAPI specs let tools generate TypeScript types and API clients, reducing mismatches between frontend and backend.",
    },
  },
];

function getConceptById(id) {
  return backendConcepts.find((c) => c.id === id);
}

function getConceptsByPhase(phase) {
  return backendConcepts.filter((c) => c.phase === phase);
}

export { PLAYLIST_URL, PHASES, backendConcepts, getConceptById, getConceptsByPhase };
