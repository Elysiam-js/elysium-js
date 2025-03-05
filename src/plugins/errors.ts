/**
 * Error Handling Plugin for Elysium.js
 * 
 * Provides standardized HTTP error classes and error handling middleware
 */

import { Elysia } from 'elysia';

/**
 * Base HTTP Error class
 */
export class HttpError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 */
export class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 */
export class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 403 Forbidden Error
 */
export class Forbidden extends HttpError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFound extends HttpError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

/**
 * 409 Conflict Error
 */
export class Conflict extends HttpError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/**
 * 422 Unprocessable Entity Error
 */
export class UnprocessableEntity extends HttpError {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}

/**
 * 429 Too Many Requests Error
 */
export class TooManyRequests extends HttpError {
  constructor(message = 'Too Many Requests') {
    super(message, 429);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

/**
 * 503 Service Unavailable Error
 */
export class ServiceUnavailable extends HttpError {
  constructor(message = 'Service Unavailable') {
    super(message, 503);
  }
}

/**
 * Error handling middleware for Elysia
 */
export function errorHandler() {
  return (app: Elysia) => 
    app.error({
      HttpError: (error, { set }) => {
        set.status = error.statusCode;
        return {
          error: error.name,
          message: error.message,
          statusCode: error.statusCode
        };
      },
      BadRequest: (error, { set }) => {
        set.status = 400;
        return {
          error: 'BadRequest',
          message: error.message,
          statusCode: 400
        };
      },
      Unauthorized: (error, { set }) => {
        set.status = 401;
        return {
          error: 'Unauthorized',
          message: error.message,
          statusCode: 401
        };
      },
      Forbidden: (error, { set }) => {
        set.status = 403;
        return {
          error: 'Forbidden',
          message: error.message,
          statusCode: 403
        };
      },
      NotFound: (error, { set }) => {
        set.status = 404;
        return {
          error: 'NotFound',
          message: error.message,
          statusCode: 404
        };
      },
      Conflict: (error, { set }) => {
        set.status = 409;
        return {
          error: 'Conflict',
          message: error.message,
          statusCode: 409
        };
      },
      UnprocessableEntity: (error, { set }) => {
        set.status = 422;
        return {
          error: 'UnprocessableEntity',
          message: error.message,
          statusCode: 422
        };
      },
      TooManyRequests: (error, { set }) => {
        set.status = 429;
        return {
          error: 'TooManyRequests',
          message: error.message,
          statusCode: 429
        };
      },
      InternalServerError: (error, { set }) => {
        set.status = 500;
        return {
          error: 'InternalServerError',
          message: error.message,
          statusCode: 500
        };
      },
      ServiceUnavailable: (error, { set }) => {
        set.status = 503;
        return {
          error: 'ServiceUnavailable',
          message: error.message,
          statusCode: 503
        };
      },
      // Default error handler
      '*': (error, { set }) => {
        console.error('Unhandled error:', error);
        set.status = 500;
        return {
          error: 'InternalServerError',
          message: 'An unexpected error occurred',
          statusCode: 500
        };
      }
    });
}

// Export all error classes
export const error = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  TooManyRequests,
  InternalServerError,
  ServiceUnavailable
};

export default { errorHandler, error };
