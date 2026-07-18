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
      "Authentication (authn) verifies WHO you are — logging in with a password, Google, or a magic link. Authorization (authz) verifies WHAT you're allowed to do — admin vs viewer, read vs write. They are separate steps: you can be authenticated (logged in) without being authorized (allowed to access a resource). Most backends implement authn with sessions, JWTs, or OAuth; authz runs after authn succeeds.",
    frontendAnalogy:
      "Logging in with Google OAuth is authentication — the provider proves who you are. Hiding the admin dashboard link unless `user.role === 'admin'` is authorization. Your React app may do both for UX, but the backend must re-verify every request because anyone can call your API directly with curl or Postman.",
    backendPerspective:
      "You implement a login endpoint that verifies credentials and issues either a session cookie or a signed JWT. Auth middleware on protected routes validates the session or token on every request and attaches the user to `req.user` or request context. Authorization checks ('does this user own this order?', 'is this user an admin?') happen in services or route guards after authentication — never trust role flags sent from the client alone.",
    keyPoints: [
      "Authn vs authz — authentication proves identity (login); authorization checks permissions (can this user do X?). A valid login does not mean the user can access every endpoint.",
      "Never trust the frontend — tokens, cookies, and role claims must be verified server-side on every protected request. Client-side route guards are for UX only.",
      "Sessions store login state on the server; the client holds only an opaque session ID in an HttpOnly cookie. JWTs embed user claims in a signed token the client stores and sends on each request — the server verifies the signature without a database lookup.",
      "OAuth 2.0 / OpenID Connect — users log in via Google, GitHub, or an enterprise IdP; your app receives tokens without ever seeing the user's password. Common for 'Sign in with Google' and SSO.",
      "API keys — long-lived secrets for server-to-server or developer access. Simpler than OAuth but harder to rotate; never expose them in frontend code or git repos.",
      "Refresh tokens — long-lived tokens used only to obtain new short-lived access tokens (JWT). Keeps access tokens short (minutes) while users stay logged in for days without re-entering credentials.",
    ],
    comparison: {
      title: "Sessions vs JWT — complete comparison",
      intro:
        "Both prove the user is logged in, but they store and verify identity very differently. Sessions are stateful (server remembers you); JWTs are stateless (server verifies a signed token without storing session data). Choose based on your app type, scaling needs, and security requirements.",
      rows: [
        {
          aspect: "Where state lives",
          session:
            "On the server — in memory, Redis, or a database. The client only holds an opaque session ID (random string) in a cookie.",
          jwt:
            "In the token itself — user ID, roles, and expiry are encoded in the JWT payload. The server verifies the cryptographic signature without looking up session state.",
        },
        {
          aspect: "What the client stores",
          session:
            "A session cookie (e.g. `connect.sid=abc123`) — typically HttpOnly, so JavaScript cannot read it. The cookie is meaningless without the server-side session record.",
          jwt:
            "The full token — in `localStorage`, `sessionStorage`, or memory (SPA), or sent as a Bearer token in the `Authorization` header. The token contains readable (but signed) claims.",
        },
        {
          aspect: "How each request is verified",
          session:
            "Server reads the session ID from the cookie, looks up the session store (Redis/DB), and loads the user. Every request requires a store lookup unless you cache sessions in memory.",
          jwt:
            "Server reads the token from the `Authorization: Bearer <token>` header, verifies the signature with a secret/public key, and trusts the payload if valid. No database lookup needed for basic authn.",
        },
        {
          aspect: "Logout & revocation",
          session:
            "Easy — delete the session from the store and clear the cookie. The user is logged out immediately on all devices if you invalidate that session ID.",
          jwt:
            "Hard — JWTs are valid until they expire; there is no server-side record to delete. You need a token blocklist (Redis), short expiry + refresh tokens, or accept that logout only works client-side until expiry.",
        },
        {
          aspect: "Horizontal scaling",
          session:
            "Requires a shared session store (Redis) when running multiple server instances — otherwise user hits server A, next request goes to server B which has no session. Sticky sessions are a fragile alternative.",
          jwt:
            "Scales easily — any server instance can verify the JWT with the same secret or public key. No shared session store needed, which is why JWTs are popular in microservices.",
        },
        {
          aspect: "XSS risk (cross-site scripting)",
          session:
            "Lower if using HttpOnly cookies — JavaScript cannot read the session ID, so stolen XSS cannot easily exfiltrate it. Still vulnerable if attacker can make requests from the victim's browser (browser sends cookie automatically).",
          jwt:
            "Higher if stored in localStorage — any XSS script can read `localStorage.getItem('token')` and send it to an attacker. Mitigate with short expiry, or store in memory only (lost on tab close).",
        },
        {
          aspect: "CSRF risk (cross-site request forgery)",
          session:
            "Higher — browsers automatically send cookies on every request to your domain, including forged requests from malicious sites. Mitigate with SameSite cookies, CSRF tokens, or double-submit cookies.",
          jwt:
            "Lower for Bearer tokens — browsers do not auto-attach `Authorization` headers; your JavaScript must add them. CSRF against API-only JWT auth is much less common than with cookie sessions.",
        },
        {
          aspect: "Token / cookie size",
          session:
            "Tiny cookie — just a session ID (32–64 bytes). User data stays on the server; you can store large permission sets without bloating every request.",
          jwt:
            "Larger — the full payload is sent on every request. Putting too many claims (roles, permissions, metadata) in the JWT increases header size and can hit HTTP limits. Keep JWTs lean.",
        },
        {
          aspect: "Best fit",
          session:
            "Traditional server-rendered apps (Rails, Laravel, Django), same-domain frontends, when you need instant logout/revocation, or when storing lots of server-side session data.",
          jwt:
            "SPAs and mobile apps on different domains, microservices, APIs consumed by multiple clients, and when you need stateless scaling without a shared session store.",
        },
      ],
      takeaway:
        "Many production apps combine both: HttpOnly session cookie for web + JWT for mobile API, or short-lived JWT access tokens with refresh tokens stored in HttpOnly cookies. There is no universal winner — match the mechanism to your client type and revocation needs.",
    },
    authMechanisms: {
      title: "Auth mechanisms in general",
      intro:
        "Beyond sessions and JWTs, backends use several patterns to prove identity and grant access. Most real apps combine multiple mechanisms — for example OAuth for login plus JWT for API calls plus API keys for webhooks.",
      items: [
        {
          name: "Password / credentials",
          description:
            "The user sends email + password to your login endpoint; you compare against a bcrypt/argon2 hash stored in the database. Still the foundation of most auth — even OAuth users often have a password option. Never store plain-text passwords; always hash with a slow algorithm and rate-limit login attempts.",
        },
        {
          name: "Session cookies",
          description:
            "After successful login, the server creates a session record and sets an HttpOnly, Secure, SameSite cookie containing the session ID. On each request the server looks up the session and loads the user. Standard for traditional web apps; pairs well with server-rendered HTML and same-site frontends.",
        },
        {
          name: "JWT (JSON Web Token)",
          description:
            "A signed, base64-encoded string with three parts: header, payload (claims like `userId`, `role`, `exp`), and signature. The server signs with a secret (HS256) or private key (RS256); clients send it as `Authorization: Bearer <token>`. Stateless and portable — ideal for SPAs, mobile apps, and service-to-service calls.",
        },
        {
          name: "OAuth 2.0 & OpenID Connect (OIDC)",
          description:
            "A protocol for delegated auth — 'Log in with Google'. The user authenticates with the provider (Google, GitHub, Okta); your app receives an authorization code or tokens without handling the password. OIDC adds a standard identity layer on top of OAuth, returning an `id_token` with user profile info. Use libraries (Passport.js, NextAuth) — do not implement the flow from scratch.",
        },
        {
          name: "Refresh tokens",
          description:
            "Long-lived tokens (days/weeks) used only to call a `/auth/refresh` endpoint and get a new short-lived access token. Access tokens expire in minutes, limiting damage if stolen. Store refresh tokens in HttpOnly cookies or secure device storage; rotate them on each use to detect theft.",
        },
        {
          name: "API keys",
          description:
            "Static secrets (e.g. `sk_live_abc123`) sent in a header (`X-API-Key`) or query param for machine-to-machine access. Common for public APIs, webhooks, and internal services. Easy to implement but hard to scope and rotate — prefer OAuth client credentials for production service auth when possible.",
        },
        {
          name: "Magic links / passwordless",
          description:
            "User enters email; server sends a one-time link with a signed token. Clicking the link logs them in without a password. Good UX for low-friction signup; tokens must be single-use, short-lived, and invalidated after use. Implemented as a special short-lived JWT or one-time session token.",
        },
        {
          name: "Multi-factor authentication (MFA)",
          description:
            "Requires a second factor after password — TOTP app (Google Authenticator), SMS code, or hardware key (WebAuthn/FIDO2). Not a separate auth mechanism but a layer on top of credentials or OAuth. Backend stores MFA secrets encrypted and verifies TOTP codes or WebAuthn assertions at login.",
        },
      ],
    },
    terminology: [
      {
        term: "Authentication (authn)",
        definition:
          "Proves who you are — verifying identity through passwords, OAuth, magic links, or API keys. The output is a confirmed user identity (user ID, email) attached to the request. Happens at login and on every subsequent protected request.",
      },
      {
        term: "Authorization (authz)",
        definition:
          "Checks what an authenticated user is allowed to do — admin vs viewer, owner vs stranger, read vs write. Runs after authn succeeds. Examples: 'can this user delete post 42?', 'does this API key have write scope?'",
      },
      {
        term: "Session",
        definition:
          "Server-side login state keyed by an opaque ID stored in an HttpOnly cookie. The server looks up the session on each request to load the user. Stateful — requires a shared store (Redis) when scaling horizontally. Easy to revoke instantly by deleting the session.",
      },
      {
        term: "JWT (JSON Web Token)",
        definition:
          "A self-contained signed token with encoded claims (user ID, roles, expiry). The server verifies the signature without a database lookup. Stateless — scales across instances easily. Hard to revoke before expiry without a blocklist or short TTL + refresh tokens.",
      },
      {
        term: "OAuth 2.0",
        definition:
          "Authorization framework for delegated access — users log in via a provider (Google, GitHub) and your app receives tokens. Your app never sees the user's password. Distinct from OIDC, which adds standardized identity (`id_token`) on top.",
      },
      {
        term: "Refresh token",
        definition:
          "A long-lived token used only to obtain new access tokens without re-login. Stored securely (HttpOnly cookie or device keychain). Rotated on each refresh to detect theft. Keeps access tokens short-lived for security.",
      },
      {
        term: "Bearer token",
        definition:
          "A token sent in the `Authorization: Bearer <token>` header. The word 'Bearer' means whoever holds the token is granted access — treat it like a password. JWTs and OAuth access tokens are commonly sent as Bearer tokens.",
      },
      {
        term: "HttpOnly cookie",
        definition:
          "A cookie flag that prevents JavaScript from reading it — mitigates XSS token theft. Essential for session cookies. Combine with `Secure` (HTTPS only) and `SameSite` (CSRF mitigation) flags in production.",
      },
    ],
    example: {
      title: "Session flow vs JWT flow",
      language: "typescript",
      code: `// ─── SESSION FLOW ───────────────────────────────────────────
// 1. Login — server creates session, sets cookie
app.post('/auth/login', async (req, res) => {
  const user = await verifyPassword(req.body.email, req.body.password);
  const sessionId = await sessionStore.create({ userId: user.id });
  res.cookie('sid', sessionId, {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400000,
  });
  res.json({ user: { id: user.id, name: user.name } });
});

// 2. Protected route — lookup session on every request
function sessionAuth(req, res, next) {
  const session = await sessionStore.get(req.cookies.sid);
  if (!session) return res.status(401).json({ error: 'Not logged in' });
  req.user = await userService.findById(session.userId);
  next();
}

// 3. Logout — delete session server-side (instant revocation)
app.post('/auth/logout', async (req, res) => {
  await sessionStore.delete(req.cookies.sid);
  res.clearCookie('sid');
  res.json({ ok: true });
});

// ─── JWT FLOW ───────────────────────────────────────────────
// 1. Login — server signs and returns token
app.post('/auth/login', async (req, res) => {
  const user = await verifyPassword(req.body.email, req.body.password);
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  res.json({ accessToken: token });
});

// 2. Protected route — verify signature, no DB lookup
function jwtAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// 3. Logout — client deletes token; server cannot revoke until expiry
//    (unless you maintain a token blocklist in Redis)`,
    },
    quiz: {
      question: "You need instant logout across all devices and run 3 server instances. Which approach fits best?",
      options: [
        "JWT in localStorage with 7-day expiry",
        "Sessions stored in Redis with HttpOnly cookies",
        "API keys in the Authorization header",
        "No auth — use IP address instead",
      ],
      correctIndex: 1,
      explanation:
        "Sessions in Redis give instant revocation (delete session = logged out) and work across multiple servers via a shared store. JWTs in localStorage cannot be revoked until expiry without a blocklist.",
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
    id: "cors",
    title: "CORS (Cross-Origin Resource Sharing)",
    phase: "Security & Pipeline",
    summary:
      "CORS is a browser security rule that blocks JavaScript from calling APIs on a different origin (domain, port, or protocol) unless the server explicitly allows it. Your `fetch('https://api.example.com/users')` from `https://myapp.com` is a cross-origin request — the browser sends it but may hide the response unless the API returns the right CORS headers. Postman and curl are not browsers, so they never enforce CORS — which is why APIs 'work in Postman but fail in the browser'.",
    frontendAnalogy:
      "When your React app on `localhost:5173` calls an API on `localhost:3000`, that's cross-origin (different ports count). The browser blocks the response unless the API says 'localhost:5173 is allowed'. You fix it on the backend by adding CORS headers — there is nothing your frontend code alone can do to bypass this security rule.",
    backendPerspective:
      "You configure CORS middleware to send `Access-Control-Allow-Origin` (which frontend origins may call your API), `Access-Control-Allow-Methods` (GET, POST, etc.), and `Access-Control-Allow-Headers` (Authorization, Content-Type). For requests with custom headers or non-simple methods, the browser first sends an OPTIONS preflight request — your server must respond 204 with the same CORS headers before the real request proceeds. In production, whitelist specific origins — never use `*` with credentials.",
    keyPoints: [
      "Same-origin = same protocol + domain + port. `https://app.com` → `https://api.app.com` is cross-origin even on the same registrable domain.",
      "Simple requests (GET, POST with standard headers) go straight through if CORS headers are present on the response.",
      "Preflight OPTIONS — browser sends OPTIONS first for PUT/DELETE, custom headers (Authorization), or JSON Content-Type. Server must answer before the real request runs.",
      "`Access-Control-Allow-Credentials: true` requires a specific origin (not `*`) and `fetch(..., { credentials: 'include' })` on the client for cookies.",
      "CORS is browser-only — server-to-server calls, mobile apps, and Postman ignore it entirely.",
    ],
    terminology: [
      {
        term: "Origin",
        definition:
          "The combination of protocol, hostname, and port — e.g. `https://app.example.com:443`. Two URLs with different origins cannot share data unless CORS allows it.",
      },
      {
        term: "Preflight request",
        definition:
          "An automatic OPTIONS request the browser sends before the real request when it detects a 'non-simple' cross-origin call. Your API must respond with allowed methods and headers.",
      },
      {
        term: "Access-Control-Allow-Origin",
        definition:
          "Response header listing which origin(s) may read the response. Set to your frontend URL in production, e.g. `https://myapp.com`.",
      },
    ],
    example: {
      title: "CORS middleware (Express)",
      language: "typescript",
      code: `import cors from 'cors';

// ✅ Production — whitelist specific origins
app.use(cors({
  origin: ['https://myapp.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies — origin cannot be '*'
}));

// Browser flow for: fetch('https://api.example.com/users', {
//   headers: { Authorization: 'Bearer ...' }
// })
// 1. Browser sends: OPTIONS /users  (preflight)
// 2. Server responds: 204 + Access-Control-Allow-Origin: https://myapp.com
// 3. Browser sends:  GET /users    (real request)
// 4. Server responds: 200 + data + CORS headers`,
    },
    quiz: {
      question: "Your API works in Postman but fetch() gets a CORS error. What's wrong?",
      options: [
        "The API is down",
        "The browser blocked the response because CORS headers are missing or wrong",
        "You need to use GET instead of POST",
        "JWT tokens don't work in browsers",
      ],
      correctIndex: 1,
      explanation:
        "Postman doesn't enforce CORS. Browsers do. The API must return Access-Control-Allow-Origin (and handle OPTIONS preflight) for cross-origin browser requests.",
    },
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting & Throttling",
    phase: "Security & Pipeline",
    summary:
      "Rate limiting caps how many requests a client can make in a time window — e.g. 100 requests per minute per IP or per API key. It protects your API from abuse, brute-force login attacks, and accidental infinite loops in frontend code. When the limit is exceeded, the server returns 429 Too Many Requests, often with a `Retry-After` header telling the client when to try again.",
    frontendAnalogy:
      "Like a form that disables the submit button for 30 seconds after 5 failed attempts — but enforced server-side so attackers can't bypass it. Your frontend should handle 429 responses gracefully (show 'slow down' message, exponential backoff on retries).",
    backendPerspective:
      "You implement rate limiting in middleware using Redis (shared across server instances) or in-memory stores for single-instance dev. Common strategies: fixed window (100/min), sliding window (smoother), or token bucket (allows bursts). Apply stricter limits on `/auth/login` and `/auth/register` than on public read endpoints. Return `429` with `Retry-After` and log blocked IPs for monitoring.",
    keyPoints: [
      "Per-IP limiting — simplest; stops basic abuse but shared NAT IPs (offices) can hit limits together.",
      "Per-user / per-API-key limiting — fairer for authenticated APIs; track by user ID or key after auth middleware.",
      "Redis-backed counters — required when running multiple server instances so all instances share the same count.",
      "Different limits per route — login: 5/min, public API: 100/min, admin: 1000/min.",
      "429 Too Many Requests — standard status; include Retry-After header (seconds until reset).",
    ],
    terminology: [
      {
        term: "Rate limit",
        definition:
          "A cap on requests per time window per client identifier (IP, user ID, API key). Exceeding it returns 429.",
      },
      {
        term: "Token bucket",
        definition:
          "Algorithm that allows bursts (bucket fills with tokens over time) while maintaining an average rate limit.",
      },
      {
        term: "Retry-After",
        definition:
          "HTTP response header telling the client how many seconds to wait before retrying after a 429 response.",
      },
    ],
    example: {
      title: "Rate limiting login endpoint",
      language: "typescript",
      code: `import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Strict limit on auth — prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts per window
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,     // RateLimit-* headers
  legacyHeaders: false,
  store: new RedisStore({ client: redis }), // shared across instances
});

app.post('/auth/login', loginLimiter, loginHandler);

// General API limit
const apiLimiter = rateLimit({ windowMs: 60_000, max: 100 });
app.use('/api/', apiLimiter);`,
    },
    quiz: {
      question: "Why rate-limit the login endpoint more strictly than GET /api/products?",
      options: [
        "GET requests are always safe",
        "Login endpoints are prime targets for brute-force password attacks",
        "Rate limiting only works on POST",
        "Products don't need authentication",
      ],
      correctIndex: 1,
      explanation:
        "Auth endpoints face brute-force attacks. Stricter limits (e.g. 5 attempts per 15 min) slow attackers without hurting normal product browsing.",
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
    id: "graphql",
    title: "GraphQL",
    phase: "Application Layer",
    summary:
      "GraphQL is an alternative to REST where the client sends a single query describing exactly what data it needs, and the server returns only that shape. One endpoint (`POST /graphql`) replaces dozens of REST routes. Frontend teams love it because you can fetch a user and their posts in one request without over-fetching or chaining multiple API calls.",
    frontendAnalogy:
      "REST is like ordering fixed menu combos — you get everything on the plate whether you need it or not. GraphQL is like building your own bowl: you specify `{ user { name posts { title } } }` and get exactly those fields. Libraries like Apollo Client or urql handle caching and queries on the frontend.",
    backendPerspective:
      "You define a schema (types, queries, mutations) and resolvers — functions that fetch data for each field. Resolvers can call services, databases, or other APIs. Watch for the N+1 problem (one query per nested field) — solve with DataLoader batching. GraphQL needs its own auth, validation, and rate limiting; complexity moves from many endpoints to one powerful endpoint.",
    keyPoints: [
      "Schema-first — define types (`User`, `Post`) and operations (`Query`, `Mutation`) before writing resolvers.",
      "Resolvers — functions mapped to each field; a `posts` field on `User` runs a resolver that queries the database.",
      "Over-fetching vs under-fetching — REST returns fixed shapes; GraphQL returns exactly what the client asks for.",
      "N+1 problem — fetching 10 users then 10 separate post queries; fix with DataLoader or JOIN in parent resolver.",
      "When to use — complex UIs with varied data needs, mobile apps on slow networks; skip for simple CRUD or public APIs.",
    ],
    terminology: [
      {
        term: "Query",
        definition:
          "A GraphQL read operation — equivalent to GET in REST. Clients request nested data in one round trip.",
      },
      {
        term: "Mutation",
        definition:
          "A GraphQL write operation — creates, updates, or deletes data. Equivalent to POST/PUT/DELETE in REST.",
      },
      {
        term: "Resolver",
        definition:
          "A function that returns the value for a field in your schema. Each field can have its own resolver.",
      },
    ],
    example: {
      title: "GraphQL query vs multiple REST calls",
      language: "graphql",
      code: `# One GraphQL request — client specifies exact shape
POST /graphql
{
  "query": "{
    user(id: 42) {
      name
      email
      posts(limit: 5) { title createdAt }
    }
  }"
}

# REST equivalent — 2+ round trips
GET /api/users/42
GET /api/users/42/posts?limit=5

# Resolver (simplified)
const resolvers = {
  Query: {
    user: (_, { id }) => userService.findById(id),
  },
  User: {
    posts: (user, { limit }) => postService.findByUser(user.id, limit),
  },
};`,
    },
    quiz: {
      question: "What's a common GraphQL performance pitfall?",
      options: [
        "It only supports GET requests",
        "N+1 queries — one DB call per nested field without batching",
        "It cannot handle authentication",
        "It replaces the need for a database",
      ],
      correctIndex: 1,
      explanation:
        "Resolvers run per field. Fetching 100 users with posts can trigger 101 DB queries. DataLoader or eager JOINs fix this.",
    },
  },
  {
    id: "pagination",
    title: "Pagination & Filtering",
    phase: "Application Layer",
    summary:
      "List endpoints never return all rows — they return a page of results plus metadata so the client can fetch more. Offset pagination (`?page=2&limit=20`) is simple but slow on large tables. Cursor pagination (`?cursor=abc&limit=20`) is faster and stable when data changes between requests. Filtering and sorting via query params (`?status=active&sort=-createdAt`) let clients narrow results without new endpoints.",
    frontendAnalogy:
      "Like infinite scroll or 'Load more' in your UI — you pass the last item's ID or page number to get the next batch. React Query's `useInfiniteQuery` maps directly to cursor-based APIs. Your table components consume `data`, `total`, `hasMore`, and `nextCursor` from the response.",
    backendPerspective:
      "You parse `page`, `limit`, `cursor`, `sort`, and filter params in the controller, validate them (max limit = 100), and pass them to the service/repository. Return a consistent envelope: `{ data: [...], meta: { total, page, limit, nextCursor, hasMore } }`. Use indexed columns for sort/filter fields. Default `limit` to something reasonable (20) and cap it to prevent abuse.",
    keyPoints: [
      "Offset pagination — `LIMIT 20 OFFSET 40` for page 3; simple but slow on deep pages (DB scans skipped rows).",
      "Cursor pagination — `WHERE id > :cursor ORDER BY id LIMIT 20`; fast and stable; no duplicate/skipped rows when data changes.",
      "Filtering — `?status=active&role=admin` maps to WHERE clauses; validate allowed filter values to prevent injection.",
      "Sorting — `?sort=-createdAt` (desc) or `?sort=name` (asc); whitelist sortable columns — never pass user input directly into ORDER BY.",
      "Response envelope — always include `hasMore` or `nextCursor` so the frontend knows whether to show 'Load more'.",
    ],
    terminology: [
      {
        term: "Offset pagination",
        definition:
          "Skip N rows with OFFSET — page 3 with limit 20 means OFFSET 40. Easy to implement but degrades on large offsets.",
      },
      {
        term: "Cursor pagination",
        definition:
          "Use the last item's ID or timestamp as a bookmark. `WHERE id > cursor` — efficient for infinite scroll and live feeds.",
      },
      {
        term: "Query string filtering",
        definition:
          "Filter params in the URL (`?status=active`) translated to database WHERE clauses. Whitelist allowed values server-side.",
      },
    ],
    example: {
      title: "Offset vs cursor pagination",
      language: "typescript",
      code: `// Offset — simple, good for admin tables with page numbers
// GET /api/users?page=2&limit=20&status=active&sort=-createdAt
async function listUsers({ page = 1, limit = 20, status, sort }) {
  const safeLimit = Math.min(limit, 100);
  const [data, total] = await Promise.all([
    db.users.findMany({
      where: { status },
      orderBy: parseSort(sort), // whitelist: createdAt, name
      skip: (page - 1) * safeLimit,
      take: safeLimit,
    }),
    db.users.count({ where: { status } }),
  ]);
  return { data, meta: { total, page, limit: safeLimit, hasMore: page * safeLimit < total } };
}

// Cursor — better for infinite scroll
// GET /api/posts?cursor=post_abc&limit=20
async function listPosts({ cursor, limit = 20 }) {
  const data = await db.posts.findMany({
    where: cursor ? { id: { gt: cursor } } : {},
    orderBy: { id: 'asc' },
    take: limit + 1, // fetch one extra to detect hasMore
  });
  const hasMore = data.length > limit;
  if (hasMore) data.pop();
  return { data, meta: { nextCursor: data.at(-1)?.id, hasMore } };
}`,
    },
    quiz: {
      question: "Why is cursor pagination better than offset for infinite scroll feeds?",
      options: [
        "Cursors use less memory in the browser",
        "Offset skips rows — slow on deep pages and can duplicate/skip items when data changes",
        "Cursor pagination doesn't need a database",
        "Offset pagination is not supported by SQL",
      ],
      correctIndex: 1,
      explanation:
        "OFFSET 10000 makes the DB scan 10000 rows to skip them. Cursors use indexed WHERE clauses and stay stable when new items are inserted.",
    },
  },
  {
    id: "idempotency",
    title: "Idempotency",
    phase: "Application Layer",
    summary:
      "An idempotent operation produces the same result whether you run it once or many times. GET and DELETE are naturally idempotent; POST is not — calling POST /orders twice creates two orders. Payment APIs, webhooks, and retry logic require explicit idempotency keys so duplicate requests don't double-charge or create duplicate records.",
    frontendAnalogy:
      "Like clicking 'Pay' twice because the button didn't disable fast enough — you want the second click to be a no-op, not a second charge. Your frontend can send an `Idempotency-Key` header (a UUID generated once per action) so the server recognizes and deduplicates retries.",
    backendPerspective:
      "You accept an `Idempotency-Key` header on POST/PATCH endpoints that create side effects (payments, orders). Store the key + response in Redis or the database for 24 hours; if the same key arrives again, return the cached response without re-running the operation. Stripe and most payment providers require this. Webhook handlers should also check event IDs to avoid processing the same event twice.",
    keyPoints: [
      "Idempotent methods — GET, PUT, DELETE: calling twice has the same effect as once. POST is NOT idempotent by default.",
      "Idempotency-Key header — client sends a unique UUID per logical operation; server stores key → response mapping.",
      "Retry safety — network timeouts cause clients to retry; without idempotency keys, retries create duplicates.",
      "Webhook deduplication — store processed event IDs (Stripe `evt_...`); skip if already handled.",
      "TTL on stored keys — expire after 24h (Stripe's default); old keys can be safely forgotten.",
    ],
    terminology: [
      {
        term: "Idempotent",
        definition:
          "An operation that can be applied multiple times without changing the result beyond the first application. GET /users/42 always returns the same user.",
      },
      {
        term: "Idempotency-Key",
        definition:
          "A unique client-generated header (UUID) sent with POST requests. Server returns the same response if the key was already processed.",
      },
      {
        term: "Exactly-once semantics",
        definition:
          "The goal of idempotency — each logical action happens once even if the network delivers duplicate requests.",
      },
    ],
    example: {
      title: "Idempotent order creation",
      language: "typescript",
      code: `// Client — generate key once, reuse on retry
const idempotencyKey = crypto.randomUUID();
await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify({ items: cart }),
});

// Server — check key before creating
app.post('/api/orders', async (req, res) => {
  const key = req.headers['idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });

  // Check if already processed
  const cached = await redis.get(\`idempotency:\${key}\`);
  if (cached) return res.status(200).json(JSON.parse(cached)); // same response

  const order = await orderService.create(req.user.id, req.body);

  // Store response for 24 hours
  await redis.setex(\`idempotency:\${key}\`, 86400, JSON.stringify(order));
  res.status(201).json(order);
});`,
    },
    quiz: {
      question: "A user's payment times out and the app retries POST /payments. Without idempotency keys, what happens?",
      options: [
        "The server returns 404",
        "The user may be charged twice",
        "The retry is automatically blocked by HTTP",
        "Only GET requests can be retried",
      ],
      correctIndex: 1,
      explanation:
        "POST is not idempotent. A retry looks like a new payment. Idempotency-Key lets the server return the original result instead of charging again.",
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
    id: "migrations",
    title: "Database Migrations",
    phase: "Application Layer",
    summary:
      "Migrations are version-controlled files that describe how to change your database schema over time — add a column, create a table, add an index. Each migration has an `up` (apply) and `down` (rollback) step. They let your whole team and every environment (dev, staging, prod) stay in sync without manually running SQL. Never edit production schema by hand — always go through a migration.",
    frontendAnalogy:
      "Like Git for your database structure — each migration is a commit that changes the schema. Your frontend TypeScript types should match the latest migration; when a migration adds `avatar_url` to users, your API types and frontend interfaces need updating too.",
    backendPerspective:
      "You write migration files with your ORM (Prisma migrate, Drizzle kit, Knex, Rails migrations) or raw SQL. Run them in CI/CD before deploying new code that depends on the new schema. Migrations run in order by timestamp — never edit a migration that has already run in production; create a new one instead. Test migrations on a copy of production data before applying.",
    keyPoints: [
      "Up / down — every migration applies a change (up) and can reverse it (down) for rollbacks.",
      "Ordered by timestamp — `20240115_add_email_to_users.sql` runs before `20240201_create_orders.sql`.",
      "Never edit applied migrations — create a new migration to fix mistakes; editing breaks environments that already ran the old file.",
      "Run before deploy — new code expecting a new column will crash if the migration hasn't run yet.",
      "Zero-downtime migrations — add nullable columns first, backfill data, then add constraints in separate steps for large tables.",
    ],
    terminology: [
      {
        term: "Migration",
        definition:
          "A versioned file that changes database schema. Tracked in a migrations table so each environment knows which have been applied.",
      },
      {
        term: "Schema drift",
        definition:
          "When dev/staging/prod databases have different structures because someone changed schema manually. Migrations prevent this.",
      },
      {
        term: "Rollback",
        definition:
          "Running the `down` step of a migration to undo a schema change. Not always possible (e.g. dropping a column loses data).",
      },
    ],
    example: {
      title: "Prisma migration workflow",
      language: "bash",
      code: `# 1. Change schema in prisma/schema.prisma
# model User {
#   id    Int    @id @default(autoincrement())
#   email String @unique
#   name  String
# + avatarUrl String?   ← new field
# }

# 2. Generate migration file
npx prisma migrate dev --name add_avatar_url
# → creates prisma/migrations/20240115_add_avatar_url/migration.sql

# 3. SQL generated automatically:
# ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

# 4. In production CI/CD:
npx prisma migrate deploy   # applies pending migrations only

# ❌ Never do this in production:
# psql -c "ALTER TABLE users ADD COLUMN avatar_url TEXT;"`,
    },
    quiz: {
      question: "A migration already ran in production. You need to change the column type. What do you do?",
      options: [
        "Edit the existing migration file",
        "Drop the production database and re-run all migrations",
        "Create a new migration that alters the column",
        "Change the schema manually in production",
      ],
      correctIndex: 2,
      explanation:
        "Never edit applied migrations — other environments already recorded them as done. Create a new migration for the change.",
    },
  },
  {
    id: "transactions",
    title: "Transactions & ACID",
    phase: "Application Layer",
    summary:
      "A database transaction groups multiple operations into one atomic unit — either all succeed or all roll back. Transferring money means debiting one account AND crediting another; if the credit fails, the debit must be undone. ACID guarantees: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed data survives crashes).",
    frontendAnalogy:
      "Like a shopping cart checkout — if payment fails, the order shouldn't be created and inventory shouldn't be reduced. From the frontend you send one POST /orders request; the backend wraps all related DB writes in a transaction so you never see half-completed state.",
    backendPerspective:
      "You wrap related writes in `db.transaction(async (tx) => { ... })` using your ORM or raw `BEGIN / COMMIT / ROLLBACK`. Use transactions when multiple tables must stay consistent (order + order_items + inventory). Keep transactions short — long-running transactions block other queries. For distributed systems across multiple databases, you need saga patterns or two-phase commit — much harder than single-DB transactions.",
    keyPoints: [
      "Atomicity — if any step fails, the entire transaction rolls back; no partial updates.",
      "Use when — creating an order + line items, transferring funds, any multi-table write that must be consistent.",
      "Isolation levels — READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE; higher = safer but slower.",
      "Keep transactions short — don't call external APIs (email, Stripe) inside a transaction; do DB work only.",
      "Deadlocks — two transactions waiting on each other; databases detect and abort one; retry logic handles it.",
    ],
    terminology: [
      {
        term: "ACID",
        definition:
          "Atomicity, Consistency, Isolation, Durability — the four guarantees of a reliable database transaction.",
      },
      {
        term: "Rollback",
        definition:
          "Undo all changes in the current transaction. Triggered automatically on error or explicitly with ROLLBACK.",
      },
      {
        term: "Isolation level",
        definition:
          "How much concurrent transactions can see each other's uncommitted changes. SERIALIZABLE is safest; READ COMMITTED is default in PostgreSQL.",
      },
    ],
    example: {
      title: "Transfer funds in a transaction",
      language: "typescript",
      code: `async function transfer(fromId: string, toId: string, amount: number) {
  return db.$transaction(async (tx) => {
    // 1. Debit sender
    const sender = await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });
    if (sender.balance < 0) throw new Error('Insufficient funds');

    // 2. Credit receiver
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    // 3. Log the transfer
    return tx.transfer.create({ data: { fromId, toId, amount } });

    // If ANY step throws → entire transaction rolls back
    // Sender balance is NOT debited if credit fails
  });
}`,
    },
    quiz: {
      question: "Why should you NOT send a welcome email inside a database transaction?",
      options: [
        "Emails can't be rolled back — if the transaction fails after sending, data is inconsistent",
        "Databases can't store email addresses",
        "Transactions are only for SELECT queries",
        "Email APIs don't support transactions",
      ],
      correctIndex: 0,
      explanation:
        "Transactions should only contain DB operations. External side effects (email, payments) can't be rolled back. Do DB work in the transaction, then send email after commit.",
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
