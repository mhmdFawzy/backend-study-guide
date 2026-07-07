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
    backendPerspective:
      "On the server you receive raw HTTP requests through a web framework (Express, Fastify, etc.) and must set the status code, headers, and body on every response. You decide which methods each endpoint accepts, enforce Content-Type rules, and return appropriate error codes when something fails. Understanding HTTP semantics — methods, status codes, headers — is the foundation of every API you build.",
    keyPoints: [
      "GET reads data, POST creates, PUT/PATCH updates, DELETE removes",
      "Status codes: 2xx success, 4xx client error, 5xx server error",
      "Headers carry metadata (auth tokens, content type, caching rules)",
      "HTTPS encrypts the connection with TLS (Transport Layer Security)",
    ],
    terminology: [
      {
        term: "HTTP method",
        definition: "The verb on a request (GET, POST, etc.) that tells the server what action you want.",
      },
      {
        term: "URL",
        definition: "The address of a resource, e.g. https://api.example.com/users/42. Routing uses the path part.",
      },
      {
        term: "Header",
        definition: "Key-value metadata on a request or response (Content-Type, Authorization, etc.).",
      },
      {
        term: "Body",
        definition: "Optional payload on POST/PUT/PATCH — usually JSON for APIs.",
      },
      {
        term: "Status code",
        definition: "A 3-digit number in the response (200 OK, 404 Not Found, 500 Server Error).",
      },
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
    backendPerspective:
      "You deploy your backend as a long-running process bound to a port — locally on 3000, in production behind nginx or a load balancer on 443. Your ops work includes choosing hosting (VPS, containers, PaaS), configuring health-check endpoints, and ensuring the process restarts on crash. Unlike a frontend bundle served from a CDN, the server must stay alive and listening to accept incoming connections.",
    keyPoints: [
      "Servers listen on a port (e.g. 3000, 8080) for incoming requests",
      "Multiple servers can sit behind a load balancer — a traffic director that sends each request to one available server",
      "You pay for uptime — the server runs even when idle",
      "Production servers need monitoring, updates, and security patches",
    ],
    terminology: [
      {
        term: "Port",
        definition: "A number (e.g. 3000, 443) that identifies which program on a server receives the request.",
      },
      {
        term: "Load balancer",
        definition: "A traffic director in front of several servers — it picks one server per request so no single machine gets overloaded.",
      },
      {
        term: "Uptime",
        definition: "How long a server stays running and reachable. Always-on servers cost money even when idle.",
      },
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
      "Routing matches an HTTP method + URL path to the handler function that should run. The path identifies which resource you want; an optional query string adds filters without changing the handler.",
    frontendAnalogy:
      "Like React Router — the URL path picks which page (handler) renders. Query params are like `?tab=settings` in the browser bar: extra info, same page.",
    backendPerspective:
      "You define routes in your framework by registering method + path patterns and attaching handler functions to each one. Path parameters arrive in `req.params` (e.g. `:id` from `/users/42`), while query strings land in `req.query` (e.g. `?page=2`). Organizing routes into versioned modules (`/api/v1/users`, `/api/v1/orders`) keeps large APIs maintainable as they grow.",
    keyPoints: [
      "A full URL has scheme, host, port, path, query string, and optional fragment — routing mainly uses method + path",
      "Path parameters are part of the path (`/users/42` → id is 42) and often pick the handler",
      "Query string parameters come after `?` (`?page=2&role=admin`) — filters and pagination, same handler",
      "Route prefixes organize APIs: `/api/v1/users` groups versioned endpoints",
    ],
    terminology: [
      {
        term: "Scheme",
        definition: "Protocol prefix — `https://` (encrypted) or `http://`.",
      },
      {
        term: "Host",
        definition: "Domain name or IP, e.g. `api.example.com`. Tells the client which server to contact.",
      },
      {
        term: "Port",
        definition: "Optional number after the host (`:8080`). HTTPS defaults to 443; dev servers often use 3000.",
      },
      {
        term: "Path",
        definition: "Everything after the host up to `?`, e.g. `/api/users/42`. Routing maps paths to handlers.",
      },
      {
        term: "Path parameter",
        definition: "A dynamic segment in the path (`:id`, `/users/42`). Identifies a specific resource.",
      },
      {
        term: "Query string",
        definition: "Optional part after `?`, e.g. `?page=2&role=admin`. Key=value pairs for filtering; not part of the path.",
      },
      {
        term: "Fragment",
        definition: "Part after `#` (e.g. `#section`). Used by browsers for in-page anchors — usually ignored by APIs.",
      },
      {
        term: "Route / handler",
        definition: "The pairing of method + path pattern to the function that runs your business logic.",
      },
    ],
    example: {
      title: "Complete URL anatomy + routing",
      language: "text",
      code: `# Full URL — every piece labeled
https://api.example.com:443/api/users/42?page=2&role=admin#profile
│      │                 │   │              │ │                 │
scheme host              port path           │ query string      fragment
                                             path param (id=42)  (browser only)

# What routing matches (method + path pattern)
GET  /api/users           → listUsers()        # static path
GET  /api/users/:id       → getUser()          # :id is a path parameter
GET  /api/users?role=admin → listUsers()       # same handler; query filters results

# In a handler (Express-style)
// GET /api/users/42?fields=name
req.params.id    // "42"  — from the path
req.query.fields // "name" — from the query string`,
    },
    quiz: {
      question: "In `GET /api/users/42?page=2`, what is `page=2`?",
      options: [
        "A path parameter",
        "A query string parameter",
        "An HTTP header",
        "Part of the hostname",
      ],
      correctIndex: 1,
      explanation:
        "Query string parameters appear after `?`. Path parameters like `42` are embedded in the path itself.",
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
    backendPerspective:
      "Middleware like `express.json()` automatically deserializes incoming JSON into `req.body` before your handler runs. When responding, `res.json(obj)` serializes JavaScript objects to JSON and sets `Content-Type: application/json`. You must validate deserialized data carefully — JSON has no Date type, so dates arrive as strings and must be parsed explicitly.",
    keyPoints: [
      "JSON is the most common text format for REST APIs",
      "Binary formats like Protobuf (Google's compact binary format) are faster but not human-readable",
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
    backendPerspective:
      "You implement login endpoints that verify credentials (password hash comparison) and issue JWTs or set session cookies. Auth middleware runs on protected routes, verifies the token on every request, and attaches the user to `req.user` or request context. Authorization checks ('can this user delete this post?') happen in services or dedicated guards after authentication succeeds.",
    keyPoints: [
      "Never trust the frontend — always verify tokens on the server",
      "JWT (JSON Web Token): stateless token with encoded user info + cryptographic signature",
      "Sessions: server stores login state; client holds a session cookie",
      "OAuth lets users log in via Google/GitHub without giving your app their password",
    ],
    terminology: [
      {
        term: "Authentication (authn)",
        definition: "Proves who you are — login with password, Google, etc.",
      },
      {
        term: "Authorization (authz)",
        definition: "Checks what you're allowed to do — admin vs viewer, read vs write.",
      },
      {
        term: "JWT",
        definition: "JSON Web Token — a signed string the client sends on each request; server verifies without storing session state.",
      },
      {
        term: "OAuth",
        definition: "Protocol for 'Log in with Google' — user authenticates with a provider, your app gets a token.",
      },
      {
        term: "Session",
        definition: "Server-side login state keyed by a cookie. Opposite of stateless JWT.",
      },
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
    backendPerspective:
      "You validate `req.body`, `req.query`, and `req.params` using schema libraries like Zod or Joi before passing data to services. Return 400 Bad Request with field-level error details when validation fails so the frontend can show useful messages. Transformations — coercing query strings to numbers, trimming whitespace — happen at this boundary so services receive clean, typed data.",
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
    backendPerspective:
      "You register middleware with `app.use()` in a deliberate order — each function receives `(req, res, next)` and either calls `next()` to continue or ends the response early. Global middleware (logging, CORS, body parser) runs on every request; route-specific middleware (auth, role checks) runs only on matching paths. Misordered middleware — for example, running auth after the handler — is a common source of security bugs.",
    keyPoints: [
      "Each middleware calls `next()` to pass control to the next layer",
      "Order matters: auth before route handler, error handler last",
      "Common uses: logging, CORS (Cross-Origin Resource Sharing — lets browsers call APIs on other domains), rate limiting, auth, body parsing",
      "Middleware can end the request early (e.g. return 401 Unauthorized)",
    ],
    terminology: [
      {
        term: "Middleware",
        definition: "A function that runs between receiving a request and your handler — can log, auth, parse, or block.",
      },
      {
        term: "next()",
        definition: "Call this to pass the request to the next middleware or handler in the chain.",
      },
      {
        term: "CORS",
        definition: "Cross-Origin Resource Sharing — browser security rule; your API must send headers allowing your frontend's domain.",
      },
      {
        term: "Body parsing",
        definition: "Middleware that reads JSON from the request body into `req.body`.",
      },
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
    backendPerspective:
      "You create a request-scoped object in early middleware that holds the authenticated user, a unique request ID, and timing metadata. Handlers and services read from this context instead of re-parsing headers or re-verifying tokens on every call. In Node you attach it to `req`; in Python you use `contextvars`; in Go you pass `context.Context` down the call chain.",
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
    title: "MVC, Controllers & Services",
    phase: "Application Layer",
    summary:
      "MVC (Model–View–Controller) is a classic pattern for organizing backend code: the Model holds data and persistence, the View formats output, and the Controller receives HTTP requests and coordinates the work. In modern APIs the View is usually JSON rather than HTML, but the separation of concerns stays the same. Controllers stay thin — they parse input, call services, and send responses — while services own the real business logic.",
    frontendAnalogy:
      "On the frontend, a page component acts like a controller: it handles user events (clicks, form submits) and decides what to render. A custom hook or API utility acts like a service — it fetches data, applies business rules, and returns results the UI can display. Just as you keep React components thin and push logic into hooks, backend controllers should delegate to services instead of doing calculations inline.",
    backendPerspective:
      "As a backend engineer, you register routes that map HTTP method + path to a controller function. The controller reads `req.params`, `req.query`, and `req.body`, validates that the request is well-formed, then calls one or more service methods. It never talks to the database directly — that belongs in the Model layer (repositories or ORM models). The controller's only output job is picking the right status code and serializing the result to JSON.",
    keyPoints: [
      "Model — represents your data and how it is stored. In practice this means database tables, ORM entities (Prisma, TypeORM), or repository classes that run queries. The model knows how to find, save, and update records but should not contain HTTP or routing logic.",
      "View — the formatted output sent back to the client. For REST APIs the view is almost always JSON (`res.json(user)`), not an HTML template. Your controller decides what shape the response takes: which fields to include, what status code to use, and whether to wrap errors in a consistent envelope.",
      "Controller — the HTTP entry point for a route. It extracts and validates input from the request, calls the appropriate service, maps service results or errors to HTTP responses, and returns. A good controller has no `if (balance < total)` business rules — only `try/catch` and status-code mapping.",
      "Service — the business logic layer between controllers and the database. Services enforce rules (pricing, permissions, workflows), orchestrate multiple models, and can be reused by REST handlers, CLI commands, background jobs, and webhooks. This is where 'check if user has enough balance' belongs.",
      "Handler vs controller — these terms are often used interchangeably in Node/Express. Technically a handler is any function that processes a request; a controller is a named group of related handlers (e.g. `UserController.create`, `UserController.list`). Frameworks like NestJS and Rails make this distinction explicit with decorator-based controller classes.",
      "Thin controller, fat service — a widely followed rule. If your controller grows beyond ~15 lines, you are probably mixing HTTP concerns with business logic. Move calculations, validations beyond syntax, and database calls into services so they can be unit-tested without mocking HTTP objects.",
    ],
    terminology: [
      {
        term: "MVC (Model–View–Controller)",
        definition:
          "An architectural pattern that splits an application into three roles. The Model manages data, the View presents it, and the Controller handles user input and coordinates between them. On the backend, MVC keeps HTTP plumbing separate from business rules and database access.",
      },
      {
        term: "Model",
        definition:
          "The data layer — database schemas, ORM models, and repository classes. Models know how to read and write records (e.g. `User.findById(42)`) but should not decide HTTP status codes or parse request bodies. In a layered API, services call models; controllers never call models directly.",
      },
      {
        term: "View",
        definition:
          "The presentation layer — what the client receives. In a JSON API, the view is the response body and headers your controller sends (`res.status(201).json({ id, name })`). In server-rendered apps (Rails, Laravel), the view can be an HTML template instead.",
      },
      {
        term: "Controller",
        definition:
          "A function or class method bound to a route that handles one HTTP action. It reads the request, delegates to services, and writes the response. Controllers are intentionally thin: they translate between HTTP and your domain, not implement domain rules themselves.",
      },
      {
        term: "Handler",
        definition:
          "Any function that runs when a request matches a route — often synonymous with controller in Express and Fastify. In larger apps, 'handler' may refer to a single route function while 'controller' refers to the file or class grouping several handlers (list, create, update, delete).",
      },
      {
        term: "Service",
        definition:
          "A class or module containing business logic independent of HTTP. Services accept plain data (user ID, cart items) and return results or throw domain errors. Because they have no `req`/`res` dependency, the same service can power an API endpoint, a cron job, or a test without changes.",
      },
    ],
    example: {
      title: "MVC flow: route → controller → service → model",
      language: "typescript",
      code: `// Route — maps HTTP to controller method
router.post('/api/orders', authMiddleware, orderController.create);

// Controller — HTTP only (thin)
class OrderController {
  async create(req, res) {
    try {
      const order = await orderService.create(req.context.user.id, req.body);
      res.status(201).json(order);           // View = JSON response
    } catch (err) {
      const status = err.code === 'INSUFFICIENT_FUNDS' ? 402 : 400;
      res.status(status).json({ error: err.message });
    }
  }
}

// Service — business logic (fat)
class OrderService {
  async create(userId: string, items: CartItem[]) {
    if (items.length === 0) throw new Error('Cart is empty');
    const total = this.calculateTotal(items);
    if (total > await walletService.getBalance(userId)) {
      throw Object.assign(new Error('Insufficient funds'), { code: 'INSUFFICIENT_FUNDS' });
    }
    return orderRepository.save({ userId, items, total }); // Model layer
  }
}

// Model / Repository — data access only
class OrderRepository {
  save(data) { return db.orders.insert(data); }
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
    backendPerspective:
      "You implement one handler per HTTP action: POST for create, GET for read, PATCH/PUT for update, DELETE for delete. Each handler delegates to a service method that interacts with the database and returns the result. Consistent status codes (201 on create, 204 on delete) and response shapes make your API predictable for frontend consumers and easier to document.",
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
    backendPerspective:
      "You design URLs around resources (`/users`, `/orders/:id`) and let HTTP methods express the action instead of embedding verbs in paths. Nested resources (`/users/42/orders`) express relationships without RPC-style URLs like `/getUserOrders`. Version your API with path prefixes (`/api/v1/`) or headers so you can evolve contracts without breaking existing clients.",
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
    backendPerspective:
      "You connect to PostgreSQL, MySQL, MongoDB, or Redis from your repository layer — never directly from controllers. Use an ORM (Prisma, Drizzle) or query builder for type safety, and write migrations to evolve your schema over time. Day-to-day concerns include indexes for slow queries, connection pooling, and wrapping related writes in transactions.",
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
    backendPerspective:
      "You structure code into three layers: controllers handle HTTP, services enforce business rules, and repositories run database queries. A discount calculation or permission check always lives in the service layer — never in SQL strings or controller conditionals. This separation lets you unit-test business logic without HTTP mocks and reuse it across APIs, CLI tools, and background jobs.",
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
    backendPerspective:
      "You add Redis or in-memory cache lookups in service methods — check cache first, query the database on miss, then write the result back with a TTL. Invalidate or update cache keys when underlying data changes (e.g. delete `user:{id}` on user update). Set `Cache-Control` headers on GET responses so browsers and CDNs can cache static or slow-changing data at the edge.",
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
    backendPerspective:
      "You publish jobs to Redis/Bull, SQS, or RabbitMQ from your handler and return an immediate HTTP response to the client. Separate worker processes consume jobs, retry on transient failure, and run with configurable concurrency limits. Use cron schedulers (node-cron, Kubernetes CronJob) for recurring tasks like nightly reports, backups, or database cleanup.",
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
    backendPerspective:
      "You define custom error classes with status codes and error codes, throw them from services, and catch them in a global error handler middleware. Log the full stack trace and request context server-side; return a safe, consistent JSON error envelope to clients. Never expose database constraint names, file paths, or internal service URLs in production responses.",
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
    backendPerspective:
      "You use a structured logger (Pino, Winston) that outputs JSON with fields like `requestId`, `userId`, and `duration_ms` on every significant event. Ship logs to stdout and aggregate them in Datadog, Grafana Loki, or CloudWatch for search and alerting. Propagate the request ID from middleware into every log line and downstream service call so you can trace a single user action across your system.",
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
    backendPerspective:
      "You hash passwords with bcrypt or argon2 before storing them, use parameterized queries for all SQL, and apply rate limiting on authentication endpoints. Validate and sanitize every input field; set security headers (HSTS, CSP) at the reverse proxy or framework level. Follow least privilege: database users, API keys, and IAM roles should only have the permissions they actually need.",
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
      "Scaling means handling more traffic. Vertical scaling = bigger server (more CPU/RAM). Horizontal scaling = more app copies behind a load balancer — a traffic director that sends each request to one available server.",
    frontendAnalogy:
      "Like code-splitting and lazy loading — don't load everything at once. Backend equivalent: cache hot data, paginate large lists, offload slow work to queues.",
    backendPerspective:
      "You profile slow endpoints first — often the fix is a missing database index or an N+1 query, not more servers. When you do scale horizontally, run multiple stateless app instances behind a load balancer and route read-heavy traffic to database read replicas. Paginate all list endpoints and enable gzip compression to reduce bandwidth and response times.",
    keyPoints: [
      "Find bottlenecks first (slow DB queries, N+1 problems)",
      "Horizontal scaling: run multiple app instances; a load balancer distributes traffic across them",
      "Read replica: a copy of the database for reads only — reduces load on the primary DB",
      "Pagination and compression reduce payload size",
    ],
    terminology: [
      {
        term: "Vertical scaling",
        definition: "Make one server bigger (more CPU/RAM). Simple but has a ceiling.",
      },
      {
        term: "Horizontal scaling",
        definition: "Run more copies of your app. A load balancer picks which copy handles each request.",
      },
      {
        term: "Load balancer",
        definition: "Sits in front of multiple servers and distributes incoming requests so no single machine is overloaded.",
      },
      {
        term: "Read replica",
        definition: "A read-only copy of your database. Offloads SELECT queries from the primary (write) database.",
      },
      {
        term: "N+1 query problem",
        definition: "1 query to fetch a list, then N extra queries (one per row) for related data. Fix with joins or eager loading.",
      },
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
    backendPerspective:
      "You expose a POST endpoint that external services (Stripe, GitHub, Shopify) call when events occur in their system. Verify request signatures using a shared secret before processing — never trust the payload blindly. Acknowledge with 200 immediately and process the event asynchronously if handling takes more than a few seconds, since providers retry on timeout.",
    keyPoints: [
      "Event-driven: server pushes data when something happens",
      "Verify signatures to ensure requests are genuine",
      "Respond quickly (200 OK), process async if needed",
      "Implement retries and idempotency (handling the same event twice won't duplicate charges or records) for reliability",
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
    backendPerspective:
      "You export handler functions that cloud platforms (AWS Lambda, Vercel Functions, Cloudflare Workers) invoke per request — there is no always-on process. Cold starts add latency after idle periods, so the first request after downtime may be noticeably slower. Ideal for low-traffic APIs, webhook receivers, and image transforms; avoid for persistent WebSocket servers or jobs exceeding platform timeouts (typically 15–30 seconds).",
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
    backendPerspective:
      "You define CI pipelines that run tests, lint, and build Docker images on every push to main or on every pull request. CD pipelines deploy passing builds to staging first, then production using rolling or blue-green strategies to minimize downtime. Dockerfiles ensure your app runs identically in development and production; infrastructure-as-code (Terraform, Pulumi) versions your cloud resources alongside application code.",
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
    backendPerspective:
      "You integrate SendGrid, Resend, or AWS SES via an SDK inside a background worker — never block the HTTP response waiting for the email API. Templates use server-side variables (`{{name}}`, `{{resetLink}}`) rendered before sending. Handle provider webhook events for bounces and spam complaints to protect your sender reputation and keep deliverability high.",
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
    backendPerspective:
      "You index documents on create or update via a sync job or event listener — Elasticsearch is a search index, not your source of truth. Query it for full-text search, autocomplete, and aggregations that would be too slow or awkward in SQL. Keep the primary database authoritative for writes; reindex in bulk when mapping or schema changes require it.",
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
    backendPerspective:
      "You load configuration from environment variables at startup through a typed config module — never commit secrets to version control. Different secret managers or `.env` files supply values for dev, staging, and production environments. Feature flags read from env vars or a config service let you toggle behavior without redeploying application code.",
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
    backendPerspective:
      "You listen for SIGTERM — sent by Kubernetes or your process manager before terminating a pod — and stop accepting new connections while finishing in-flight requests. Close database connection pools, Redis clients, and message queue consumers gracefully, with a timeout fallback to force exit. Fast startup times paired with proper shutdown make rolling deploys seamless with zero dropped requests.",
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
    backendPerspective:
      "Node's event loop handles thousands of concurrent I/O-bound requests via async/await — but blocking the loop with synchronous CPU-heavy code stalls all in-flight requests. Use `Promise.all` for independent async calls within one handler; offload CPU-bound work to worker threads or background job queues. Languages like Go and Java offer true parallelism with goroutines and threads natively, which suits CPU-heavy workloads better than Node alone.",
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
    backendPerspective:
      "You generate presigned S3 or R2 URLs in an API endpoint so clients upload files directly to object storage without streaming bytes through your server. Store only the public or CDN URL in your database — never the raw file bytes. For downloads, stream files from storage through your server or serve via signed CDN URLs to avoid loading multi-megabyte files entirely into memory.",
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
    backendPerspective:
      "You upgrade an HTTP connection to WebSocket for bidirectional communication, or keep HTTP open with Server-Sent Events for server→client streams. When running multiple server instances, use Redis Pub/Sub or a message broker to broadcast events across nodes so all connected clients receive updates regardless of which instance they are on. Reserve polling endpoints for low-frequency updates only — they generate unnecessary load at scale.",
    keyPoints: [
      "WebSockets: two-way, persistent connection (chat, games)",
      "SSE: one-way server push (live feeds, notifications)",
      "Polling: client asks repeatedly — simple but wasteful",
      "Pub/Sub (publish/subscribe — often via Redis) broadcasts messages between multiple server instances",
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
    backendPerspective:
      "You write unit tests for services with mocked repositories, and integration tests that spin up the real app against a test database. Use supertest or similar libraries to hit endpoints and assert status codes, response bodies, and side effects in the database. Run the full suite in CI on every pull request — a broken production deploy costs far more than a few extra minutes of test runtime.",
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
    backendPerspective:
      "You follow these principles in practice: one repo deployed to multiple environments, all config via environment variables, and stateless app processes with session data stored in Redis or the database. Admin tasks like migrations run as separate one-off processes, not inside your web server startup routine. Logs go to stdout as structured streams; backing services (DB, Redis, queues) are attached resources swappable per environment.",
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
        "Stateless servers can scale horizontally — a load balancer (traffic director) can send any request to any instance because no server holds session state in memory.",
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
    backendPerspective:
      "You maintain an `openapi.yaml` (or generate it from code annotations) that describes every endpoint, request body, and response schema. Tools render Swagger UI docs for your team and generate TypeScript clients for the frontend automatically. API-first teams write the spec before implementation so frontend and backend can work in parallel against a shared, versioned contract.",
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
