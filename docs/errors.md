# Error Handling in Elysium.js

Elysium.js provides a standardized error handling system that makes it easy to throw and handle HTTP errors in your application.

## Built-in Error Classes

Elysium.js includes the following HTTP error classes:

| Error Class | HTTP Status Code | Default Message |
|-------------|------------------|-----------------|
| `BadRequest` | 400 | Bad Request |
| `Unauthorized` | 401 | Unauthorized |
| `Forbidden` | 403 | Forbidden |
| `NotFound` | 404 | Not Found |
| `Conflict` | 409 | Conflict |
| `UnprocessableEntity` | 422 | Unprocessable Entity |
| `TooManyRequests` | 429 | Too Many Requests |
| `InternalServerError` | 500 | Internal Server Error |
| `ServiceUnavailable` | 503 | Service Unavailable |

## Throwing Errors

You can throw errors in your route handlers using the `error` object:

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.group('/api', (app) =>
    app.get('/users/:id', ({ params }) => {
      // Check if user exists
      const user = findUser(params.id);
      
      if (!user) {
        throw error.NotFound(`User with ID ${params.id} not found`);
      }
      
      return user;
    })
  );
```

## Error Response Format

When an error is thrown, Elysium.js will automatically return a standardized JSON response:

```json
{
  "error": "NotFound",
  "message": "User with ID 123 not found",
  "statusCode": 404
}
```

## Custom Error Handling

You can customize error handling by adding your own error handlers:

```typescript
import { Elysia } from 'elysia';
import { error } from 'elysium-js';

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

export default (app: Elysia) =>
  app.error({
    CustomError: (error, { set }) => {
      set.status = 418; // I'm a teapot
      return {
        error: 'CustomError',
        message: error.message,
        statusCode: 418
      };
    }
  });
```

## Error Handling in Components

You can also handle errors in your `.els` components using error boundaries:

```typescript
// app/routes/+error.els
<script>
  // The error is passed as a prop
  const { error } = props;
  
  // You can log the error
  console.error('Error caught by error boundary:', error);
</script>

<div class="error-container">
  <h1>Something went wrong</h1>
  <p>{error.message}</p>
  <button onclick={() => window.location.reload()}>
    Try again
  </button>
</div>
```

## Global Error Handling

Elysium.js automatically sets up global error handling when you create your application:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium();

// The error handler is already configured
```

This ensures that all unhandled errors are properly caught and formatted as HTTP responses.
