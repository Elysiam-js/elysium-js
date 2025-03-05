# Standardized Responses in Elysium.js

Elysium.js provides a standardized way to format API responses, making your API more consistent and easier to consume.

## Standard Response Format

The standard response format includes:

```json
{
  "status": 200,
  "message": "Success",
  "data": {
    // Your response data here
  }
}
```

## Using the Response Formatter

The response formatter is automatically included when you create an Elysium application. It adds several helper methods to your route handlers:

### Success Response (200 OK)

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.get('/api/users', ({ success }) => {
    const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
    
    // Returns a 200 OK response with the users data
    return success(users, 'Users retrieved successfully');
  });
```

Response:

```json
{
  "status": 200,
  "message": "Users retrieved successfully",
  "data": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ]
}
```

### Created Response (201 Created)

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.post('/api/users', ({ body, created }) => {
    const newUser = { id: 3, name: body.name };
    
    // Returns a 201 Created response with the new user data
    return created(newUser, 'User created successfully');
  });
```

Response:

```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "name": "Alice"
  }
}
```

### Accepted Response (202 Accepted)

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.post('/api/tasks', ({ accepted }) => {
    // Start a long-running task
    startBackgroundTask();
    
    // Returns a 202 Accepted response
    return accepted('Task scheduled for processing');
  });
```

Response:

```json
{
  "status": 202,
  "message": "Task scheduled for processing"
}
```

### No Content Response (204 No Content)

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.delete('/api/users/:id', ({ params, noContent }) => {
    // Delete the user
    deleteUser(params.id);
    
    // Returns a 204 No Content response
    return noContent();
  });
```

This will return a response with a 204 status code and no body.

## Error Responses

Error responses are handled automatically by the error handling system. When you throw an error using the `error` object, it will be formatted as:

```json
{
  "error": "NotFound",
  "message": "User with ID 123 not found",
  "statusCode": 404
}
```

See the [Error Handling](./errors.md) documentation for more details.

## Disabling Standard Responses

If you prefer to use your own response format, you can disable the standard response formatter when creating your Elysium application:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  standardResponses: false
});
```

This will allow you to return any response format you prefer in your route handlers.
