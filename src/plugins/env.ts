/**
 * Environment Variables Plugin for Elysium.js
 * 
 * Provides support for loading and accessing environment variables in your Elysium.js application
 */

import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import fs from 'fs';
import path from 'path';

/**
 * Environment variables configuration
 */
export interface EnvConfig {
  /**
   * Path to the .env file
   */
  path?: string;
  
  /**
   * Whether to override existing environment variables
   */
  override?: boolean;
  
  /**
   * Environment-specific .env file to load (e.g., .env.development)
   */
  environment?: string;
  
  /**
   * Public environment variables prefix
   */
  publicPrefix?: string;
}

/**
 * Load environment variables from .env files
 */
export function loadEnv(options: EnvConfig = {}): Record<string, string> {
  const {
    path: envPath = '.env',
    override = false,
    environment = process.env.NODE_ENV || 'development',
    publicPrefix = 'PUBLIC_',
  } = options;
  
  // Load base .env file
  const baseEnvPath = path.resolve(process.cwd(), envPath);
  if (fs.existsSync(baseEnvPath)) {
    const baseEnv = config({ path: baseEnvPath, override });
    expand(baseEnv);
  }
  
  // Load environment-specific .env file
  const envSpecificPath = path.resolve(process.cwd(), `${envPath}.${environment}`);
  if (fs.existsSync(envSpecificPath)) {
    const envSpecific = config({ path: envSpecificPath, override });
    expand(envSpecific);
  }
  
  // Load local .env file (for development overrides, not committed to version control)
  const localEnvPath = path.resolve(process.cwd(), `${envPath}.local`);
  if (fs.existsSync(localEnvPath)) {
    const localEnv = config({ path: localEnvPath, override });
    expand(localEnv);
  }
  
  // Extract public environment variables
  const publicEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(publicPrefix) && value !== undefined) {
      // Remove the prefix for client-side usage
      const publicKey = key.replace(publicPrefix, '');
      publicEnv[publicKey] = value;
    }
  }
  
  return publicEnv;
}

/**
 * Get the value of an environment variable
 * 
 * @param key - The environment variable key
 * @param defaultValue - Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Get the value of an environment variable as a number
 * 
 * @param key - The environment variable key
 * @param defaultValue - Default value if the environment variable is not set or not a valid number
 * @returns The environment variable value as a number or the default value
 */
export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get the value of an environment variable as a boolean
 * 
 * @param key - The environment variable key
 * @param defaultValue - Default value if the environment variable is not set
 * @returns The environment variable value as a boolean or the default value
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean | undefined {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

/**
 * Check if an environment variable is defined
 * 
 * @param key - The environment variable key
 * @returns True if the environment variable is defined, false otherwise
 */
export function hasEnv(key: string): boolean {
  return process.env[key] !== undefined;
}

/**
 * Environment variables manager
 */
export const env = {
  load: loadEnv,
  get: getEnv,
  getNumber: getEnvNumber,
  getBoolean: getEnvBoolean,
  has: hasEnv,
};

export default { loadEnv, getEnv, getEnvNumber, getEnvBoolean, hasEnv, env };
