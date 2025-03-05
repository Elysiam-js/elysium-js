# Security

<GlassyCard 
  title="Securing Your Elysium-js Application" 
  icon="🔒"
  description="Learn best practices for securing your Elysium-js application against common vulnerabilities">

Security is a critical aspect of web application development. This guide covers best practices for securing your Elysium-js application against common vulnerabilities.

</GlassyCard>

## Authentication

### Implementing User Authentication

Elysium-js doesn't include authentication out of the box, but you can implement it using various strategies:

#### JWT Authentication

JSON Web Tokens (JWT) are a popular choice for authentication:

```typescript
// app/utils/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d'; // 1 day

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

#### Authentication Middleware

Create middleware to protect routes:

```typescript
// app/middleware/auth.ts
import { Elysia } from 'elysia';
import { verifyToken } from '../utils/auth';

export const auth = new Elysia()
  .derive(({ request, set }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { isAuthenticated: false, user: null };
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      set.status = 401;
      return { isAuthenticated: false, user: null };
    }
    
    return {
      isAuthenticated: true,
      user: payload
    };
  });
```

Use the middleware to protect routes:

```typescript
// app/routes/api/protected.ts
import { Elysia } from 'elysia';
import { auth } from '../../middleware/auth';

export const protectedRoutes = new Elysia()
  .use(auth)
  .get('/api/protected', ({ isAuthenticated, user, set }) => {
    if (!isAuthenticated) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
    
    return {
      message: 'This is a protected route',
      user
    };
  });
```

### Password Hashing

Always hash passwords before storing them:

```typescript
// app/utils/password.ts
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}
```

Use these functions when creating and authenticating users:

```typescript
// Creating a user
app.post('/api/users', async ({ body }) => {
  const { email, password } = body;
  
  // Hash the password
  const hashedPassword = await hashPassword(password);
  
  // Create the user
  const user = await db.insert(users).values({
    email,
    password: hashedPassword
  });
  
  return user;
});

// Authenticating a user
app.post('/api/login', async ({ body }) => {
  const { email, password } = body;
  
  // Find the user
  const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!user) {
    return { error: 'Invalid credentials' };
  }
  
  // Verify the password
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return { error: 'Invalid credentials' };
  }
  
  // Generate a token
  const token = generateToken(user);
  
  return { token };
});
```

## Input Validation

### Validating User Input

Always validate user input to prevent security vulnerabilities:

```typescript
// app/utils/validation.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
```

Use these schemas to validate input:

```typescript
// app/routes/api/users.ts
import { Elysia } from 'elysia';
import { userSchema, loginSchema } from '../../utils/validation';

export const userRoutes = new Elysia()
  .post('/api/users', async ({ body }) => {
    // Validate the input
    const result = userSchema.safeParse(body);
    
    if (!result.success) {
      return { error: result.error };
    }
    
    // Process the validated input
    const { email, password, name } = result.data;
    
    // ...
  })
  .post('/api/login', async ({ body }) => {
    // Validate the input
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return { error: result.error };
    }
    
    // Process the validated input
    const { email, password } = result.data;
    
    // ...
  });
```

### Sanitizing User Input

Sanitize user input to prevent XSS attacks:

```typescript
// app/utils/sanitize.ts
import { sanitize } from 'isomorphic-dompurify';

export function sanitizeHtml(html) {
  return sanitize(html);
}
```

Use this function when rendering user-generated content:

```tsx
// app/components/Comment.tsx
import { sanitizeHtml } from '../utils/sanitize';

export function Comment({ comment }) {
  // Sanitize the comment content
  const sanitizedContent = sanitizeHtml(comment.content);
  
  return (
    <div className="comment">
      <h3>{comment.author}</h3>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
}
```

## Database Security

### Preventing SQL Injection

Use parameterized queries to prevent SQL injection:

```typescript
// Good - Parameterized query
const user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

// Bad - String concatenation
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

### Securing Database Credentials

Store database credentials in environment variables:

```
# .env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

Access these variables in your code:

```typescript
// app/db/index.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data.db',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

## HTTPS

### Enforcing HTTPS

In production, always use HTTPS to encrypt data in transit:

```typescript
// src/index.ts
import { Elysia } from 'elysia';

const app = new Elysia()
  // ... your application
  .onRequest(({ request, set }) => {
    // Redirect HTTP to HTTPS in production
    if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
      set.redirect = `https://${request.headers.get('host')}${request.url}`;
    }
  })
  .listen(3000);
```

### HSTS

Implement HTTP Strict Transport Security (HSTS) to prevent downgrade attacks:

```typescript
// src/index.ts
import { Elysia } from 'elysia';

const app = new Elysia()
  // ... your application
  .onResponse(({ set }) => {
    // Set HSTS header in production
    if (process.env.NODE_ENV === 'production') {
      set.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }
  })
  .listen(3000);
```

## Cross-Site Scripting (XSS)

### Content Security Policy

Implement a Content Security Policy to prevent XSS attacks:

```typescript
// src/index.ts
import { Elysia } from 'elysia';

const app = new Elysia()
  // ... your application
  .onResponse(({ set }) => {
    // Set CSP header
    set.headers['Content-Security-Policy'] = `
      default-src 'self';
      script-src 'self' https://unpkg.com;
      style-src 'self' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data:;
      connect-src 'self' https://api.example.com;
    `;
  })
  .listen(3000);
```

### XSS Prevention

Prevent XSS by properly escaping output:

```tsx
// Good - Properly escaped output
<div>{user.name}</div>

// Bad - Unescaped output
<div dangerouslySetInnerHTML={{ __html: user.name }} />
```

Only use `dangerouslySetInnerHTML` with sanitized content:

```tsx
// Good - Sanitized content
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(user.bio) }} />
```

## Cross-Site Request Forgery (CSRF)

### CSRF Protection

Implement CSRF protection for state-changing operations:

```typescript
// app/middleware/csrf.ts
import { Elysia } from 'elysia';
import { randomBytes } from 'crypto';

export const csrf = new Elysia()
  .derive(({ request, set, cookie }) => {
    // Generate a CSRF token if one doesn't exist
    if (!cookie.csrf) {
      const token = randomBytes(32).toString('hex');
      cookie.csrf = token;
    }
    
    // Check CSRF token for non-GET requests
    if (request.method !== 'GET') {
      const requestToken = request.headers.get('x-csrf-token');
      
      if (requestToken !== cookie.csrf) {
        set.status = 403;
        return { error: 'Invalid CSRF token' };
      }
    }
    
    return {
      csrfToken: cookie.csrf
    };
  });
```

Use the middleware in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { csrf } from '../app/middleware/csrf';

const app = new Elysia()
  .use(csrf)
  // ... your application
  .listen(3000);
```

Include the CSRF token in forms:

```tsx
// app/components/Form.tsx
export function Form({ csrfToken, action, method, children }) {
  return (
    <form action={action} method={method}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      {children}
    </form>
  );
}
```

## Rate Limiting

### Implementing Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// app/middleware/rateLimit.ts
import { Elysia } from 'elysia';

// Simple in-memory rate limiter
const requests = new Map();

export const rateLimit = new Elysia()
  .derive(({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // 100 requests per minute
    
    // Get the requests for this IP
    const requestTimestamps = requests.get(ip) || [];
    
    // Filter out old requests
    const recentRequests = requestTimestamps.filter(timestamp => now - timestamp < windowMs);
    
    // Check if the IP has exceeded the rate limit
    if (recentRequests.length >= maxRequests) {
      set.status = 429;
      set.headers['Retry-After'] = '60';
      return { error: 'Too many requests' };
    }
    
    // Add the current request timestamp
    recentRequests.push(now);
    requests.set(ip, recentRequests);
  });
```

Use the middleware in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { rateLimit } from '../app/middleware/rateLimit';

const app = new Elysia()
  .use(rateLimit)
  // ... your application
  .listen(3000);
```

## Security Headers

### Implementing Security Headers

Implement security headers to protect your application:

```typescript
// app/middleware/securityHeaders.ts
import { Elysia } from 'elysia';

export const securityHeaders = new Elysia()
  .onResponse(({ set }) => {
    // Set security headers
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-Frame-Options'] = 'DENY';
    set.headers['X-XSS-Protection'] = '1; mode=block';
    set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    set.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()';
  });
```

Use the middleware in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { securityHeaders } from '../app/middleware/securityHeaders';

const app = new Elysia()
  .use(securityHeaders)
  // ... your application
  .listen(3000);
```

## Dependency Security

### Keeping Dependencies Updated

Regularly update your dependencies to fix security vulnerabilities:

```bash
bun update
```

### Auditing Dependencies

Audit your dependencies for security vulnerabilities:

```bash
bun audit
```

## Error Handling

### Secure Error Handling

Implement secure error handling to prevent information leakage:

```typescript
// app/middleware/errorHandler.ts
import { Elysia } from 'elysia';

export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    // Log the error
    console.error(`Error: ${code}`, error);
    
    // Return a generic error message in production
    if (process.env.NODE_ENV === 'production') {
      set.status = code === 'NOT_FOUND' ? 404 : 500;
      return { error: code === 'NOT_FOUND' ? 'Not Found' : 'Internal Server Error' };
    }
    
    // Return detailed error information in development
    set.status = code === 'NOT_FOUND' ? 404 : 500;
    return { error: code, message: error.message, stack: error.stack };
  });
```

Use the middleware in your application:

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { errorHandler } from '../app/middleware/errorHandler';

const app = new Elysia()
  .use(errorHandler)
  // ... your application
  .listen(3000);
```

## Best Practices

### Keep Secrets Secure

- Store secrets in environment variables
- Don't commit secrets to version control
- Use a secrets management service in production

### Follow the Principle of Least Privilege

- Only grant the permissions that are necessary
- Limit access to sensitive operations
- Implement role-based access control

### Implement Proper Logging

- Log security events
- Don't log sensitive information
- Use a structured logging format

### Regular Security Audits

- Conduct regular security audits
- Use automated security scanning tools
- Stay informed about security best practices

## Conclusion

Security is an ongoing process, not a one-time task. By following these guidelines, you can create a secure Elysium-js application that protects your users' data and your organization's reputation.
