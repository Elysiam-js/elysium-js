/**
 * JWT Authentication Plugin for Elysium.js
 * 
 * Provides JWT Bearer token authentication for your Elysia application
 */

import { Elysia, t } from 'elysia';
import jwt from 'jsonwebtoken';

// Default options
const defaultOptions = {
  secret: process.env.JWT_SECRET || 'elysium-secret-key',
  expiresIn: '1d',
  algorithm: 'HS256',
  issuer: 'elysium-js',
  audience: 'elysium-users',
};

// JWT payload interface
export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * JWT Authentication plugin
 */
export function jwtAuth(options = {}) {
  const config = { ...defaultOptions, ...options };
  
  return (app: Elysia) => 
    app
      .state('jwt', {
        /**
         * Sign a JWT token
         * 
         * @param payload - Data to include in the token
         * @param options - JWT sign options
         * @returns Signed JWT token
         */
        sign: (payload: JwtPayload, options = {}) => {
          return jwt.sign(payload, config.secret, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm as jwt.Algorithm,
            issuer: config.issuer,
            audience: config.audience,
            ...options,
          });
        },
        
        /**
         * Verify a JWT token
         * 
         * @param token - JWT token to verify
         * @param options - JWT verify options
         * @returns Decoded token payload
         */
        verify: (token: string, options = {}) => {
          return jwt.verify(token, config.secret, {
            issuer: config.issuer,
            audience: config.audience,
            ...options,
          }) as JwtPayload;
        },
        
        /**
         * Decode a JWT token without verification
         * 
         * @param token - JWT token to decode
         * @returns Decoded token payload or null if invalid
         */
        decode: (token: string) => {
          return jwt.decode(token) as JwtPayload | null;
        },
      })
      .derive(({ headers, error }) => {
        return {
          /**
           * Get the authenticated user from the JWT token
           * 
           * @returns The authenticated user
           * @throws Unauthorized error if no valid token is found
           */
          getAuthUser: () => {
            const authHeader = headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              throw error.Unauthorized('Missing or invalid authorization header');
            }
            
            const token = authHeader.substring(7);
            
            try {
              return jwt.verify(token, config.secret, {
                issuer: config.issuer,
                audience: config.audience,
              }) as JwtPayload;
            } catch (err) {
              throw error.Unauthorized('Invalid or expired token');
            }
          },
        };
      });
}

/**
 * Authentication middleware
 * 
 * @returns Middleware function that checks for a valid JWT token
 */
export function authenticate() {
  return (app: Elysia) =>
    app.derive(({ headers, error }) => {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw error.Unauthorized('Missing or invalid authorization header');
      }
      
      const token = authHeader.substring(7);
      const jwt = app.store.jwt;
      
      try {
        const user = jwt.verify(token);
        return { user };
      } catch (err) {
        throw error.Unauthorized('Invalid or expired token');
      }
    });
}

export default { jwtAuth, authenticate };
