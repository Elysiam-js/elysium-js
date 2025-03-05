/**
 * JWT Authentication Plugin for Elysium.js
 * 
 * Provides JWT Bearer token authentication for your Elysia application
 */

import { Elysia, t } from 'elysia';

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

// Simple JWT implementation
class SimpleJwt {
  private secret: string;
  
  constructor(secret: string) {
    this.secret = secret;
  }
  
  /**
   * Sign a JWT token
   */
  sign(payload: JwtPayload, options: any = {}): string {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = options.expiresIn || defaultOptions.expiresIn;
    const exp = now + (typeof expiresIn === 'string' 
      ? parseInt(expiresIn) * 86400 // Convert days to seconds
      : expiresIn);
    
    const tokenPayload = {
      ...payload,
      iat: now,
      exp,
      iss: options.issuer || defaultOptions.issuer,
      aud: options.audience || defaultOptions.audience
    };
    
    // Base64 encode the header and payload
    const header = this.base64UrlEncode(JSON.stringify({ 
      alg: options.algorithm || defaultOptions.algorithm, 
      typ: 'JWT' 
    }));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    
    // Create signature
    const signature = this.createSignature(`${header}.${encodedPayload}`, this.secret);
    
    // Return the complete token
    return `${header}.${encodedPayload}.${signature}`;
  }
  
  /**
   * Verify a JWT token
   */
  verify(token: string): JwtPayload | null {
    try {
      const [headerB64, payloadB64, signatureB64] = token.split('.');
      
      // Verify signature
      const expectedSignature = this.createSignature(`${headerB64}.${payloadB64}`, this.secret);
      if (signatureB64 !== expectedSignature) {
        return null;
      }
      
      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(payloadB64)) as JwtPayload;
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null;
      }
      
      return payload;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Base64Url encode a string
   */
  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  /**
   * Base64Url decode a string
   */
  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString();
  }
  
  /**
   * Create a simple HMAC signature
   */
  private createSignature(data: string, secret: string): string {
    // Simple HMAC implementation using crypto module
    const crypto = require('crypto');
    return this.base64UrlEncode(
      crypto.createHmac('sha256', secret)
        .update(data)
        .digest('base64')
    );
  }
}

/**
 * JWT Authentication plugin
 */
export function jwtAuth(options = {}) {
  const config = { ...defaultOptions, ...options };
  const jwtInstance = new SimpleJwt(config.secret);
  
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
          return jwtInstance.sign(payload, {
            expiresIn: config.expiresIn,
            algorithm: config.algorithm,
            issuer: config.issuer,
            audience: config.audience,
            ...options,
          });
        },
        
        /**
         * Verify a JWT token
         * 
         * @param token - JWT token to verify
         * @returns Decoded token payload or null if invalid
         */
        verify: (token: string) => {
          return jwtInstance.verify(token);
        },
        
        /**
         * Decode a JWT token without verification
         * 
         * @param token - JWT token to decode
         * @returns Decoded token payload
         */
        decode: (token: string) => {
          const [, payloadB64] = token.split('.');
          return JSON.parse(Buffer.from(payloadB64, 'base64').toString());
        },
      });
}

/**
 * Authentication middleware
 * 
 * @returns Middleware function that checks for a valid JWT token
 */
export function authenticate() {
  return (app: Elysia) => 
    app.derive(({ headers, jwt, error }) => {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw error.Unauthorized('Missing or invalid authorization header');
      }
      
      const token = authHeader.substring(7);
      const payload = jwt.verify(token);
      
      if (!payload) {
        throw error.Unauthorized('Invalid or expired token');
      }
      
      return {
        auth: {
          user: payload,
          token,
        },
      };
    });
}

export default { jwtAuth, authenticate };
