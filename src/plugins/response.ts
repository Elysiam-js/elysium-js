/**
 * Response Plugin for Elysium.js
 * 
 * Provides standardized response formatting for your Elysia application
 */

import { Elysia } from 'elysia';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

/**
 * Response formatter middleware
 */
export function responseFormatter() {
  return (app: Elysia) =>
    app.derive(({ set }) => {
      return {
        /**
         * Send a success response
         * 
         * @param data - Response data
         * @param message - Success message
         * @param status - HTTP status code (default: 200)
         */
        success<T>(data?: T, message = 'Success', status = 200): ApiResponse<T> {
          set.status = status;
          return {
            status,
            message,
            data
          };
        },
        
        /**
         * Send a created response
         * 
         * @param data - Created resource data
         * @param message - Success message
         */
        created<T>(data?: T, message = 'Resource created successfully'): ApiResponse<T> {
          set.status = 201;
          return {
            status: 201,
            message,
            data
          };
        },
        
        /**
         * Send an accepted response
         * 
         * @param message - Success message
         */
        accepted(message = 'Request accepted'): ApiResponse {
          set.status = 202;
          return {
            status: 202,
            message
          };
        },
        
        /**
         * Send a no content response
         */
        noContent(): void {
          set.status = 204;
        }
      };
    });
}

export default { responseFormatter };
