# JWT Authentication in Elysium.js

Elysium.js provides built-in JWT (JSON Web Token) authentication to secure your API endpoints.

## Setup

JWT authentication is disabled by default. To enable it, set the `auth` option to `true` when creating your Elysium application:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  auth: true
});
```

## Configuration

By default, the JWT authentication plugin uses the following configuration:

```typescript
{
  secret: process.env.JWT_SECRET || 'elysium-secret-key',
  expiresIn: '1d',
  algorithm: 'HS256',
  issuer: 'elysium-js',
  audience: 'elysium-users'
}
```

You can customize these settings by providing your own configuration:

```typescript
import { createElysium, jwtAuth } from 'elysium-js';

const app = createElysium();

app.use(jwtAuth({
  secret: 'your-custom-secret',
  expiresIn: '7d',
  algorithm: 'HS512'
}));
```

## Using JWT Authentication

### Generating Tokens

You can generate JWT tokens for your users using the `jwt.sign` method:

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.post('/api/login', ({ body, jwt, success, error }) => {
    const { username, password } = body;
    
    // Validate user credentials (example)
    const user = authenticateUser(username, password);
    
    if (!user) {
      throw error.Unauthorized('Invalid username or password');
    }
    
    // Generate a JWT token
    const token = jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role
    });
    
    return success({
      user: {
        id: user.id,
        username: user.username
      },
      token
    }, 'Login successful');
  });
```

### Protecting Routes

You can protect your routes using the `authenticate` middleware:

```typescript
import { Elysia } from 'elysia';
import { authenticate } from 'elysium-js';

export default (app: Elysia) =>
  app.group('/api/protected', (app) =>
    app
      .use(authenticate())
      .get('/profile', ({ user, success }) => {
        // The user object is available from the JWT payload
        return success({
          id: user.sub,
          username: user.username,
          role: user.role
        }, 'Profile retrieved successfully');
      })
  );
```

### Getting the Authenticated User

You can also manually get the authenticated user in your route handlers:

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.get('/api/me', ({ getAuthUser, success, error }) => {
    try {
      // This will throw an error if no valid token is found
      const user = getAuthUser();
      
      return success({
        id: user.sub,
        username: user.username,
        role: user.role
      }, 'User retrieved successfully');
    } catch (err) {
      throw error.Unauthorized('Not authenticated');
    }
  });
```

## Client-Side Usage

To authenticate requests from the client, include the JWT token in the `Authorization` header:

```javascript
// Example fetch request with JWT token
fetch('/api/protected/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Error Handling

When a request is made to a protected route without a valid token, the authentication middleware will automatically throw an `Unauthorized` error with a 401 status code:

```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header",
  "statusCode": 401
}
```

## Best Practices

1. **Use Environment Variables**: Always store your JWT secret in an environment variable, not in your code.
2. **Short Expiration Times**: Use short expiration times for tokens to reduce the risk of token theft.
3. **HTTPS**: Always use HTTPS in production to prevent token interception.
4. **Refresh Tokens**: For longer sessions, implement a refresh token strategy.
5. **Payload Size**: Keep the JWT payload small to reduce overhead on each request.
