/**
 * Environment Variables Plugin for Elysium.js
 * 
 * Provides support for loading and accessing environment variables in your Elysium.js application
 */

import fs from 'fs';
import path from 'path';

// Simple dotenv implementation
function parseDotenv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      continue;
    }
    
    // Parse key-value pairs
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // Replace escaped newlines
      value = value.replace(/\\n/g, '\n');
      
      result[key] = value;
    }
  }
  
  return result;
}

// Simple dotenv-expand implementation
function expandEnv(env: Record<string, string>): Record<string, string> {
  const result = { ...env };
  
  // Expand variables
  for (const key in result) {
    let value = result[key];
    
    // Replace ${VAR} or $VAR with their values
    value = value.replace(/\${([^}]+)}/g, (_, varName) => {
      return result[varName] || process.env[varName] || '';
    });
    
    value = value.replace(/\$([a-zA-Z0-9_]+)/g, (_, varName) => {
      return result[varName] || process.env[varName] || '';
    });
    
    result[key] = value;
  }
  
  return result;
}

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
  let envVars: Record<string, string> = {};
  
  if (fs.existsSync(baseEnvPath)) {
    const content = fs.readFileSync(baseEnvPath, 'utf-8');
    const parsed = parseDotenv(content);
    envVars = { ...envVars, ...parsed };
  }
  
  // Load environment-specific .env file
  const envSpecificPath = path.resolve(process.cwd(), `${envPath}.${environment}`);
  if (fs.existsSync(envSpecificPath)) {
    const content = fs.readFileSync(envSpecificPath, 'utf-8');
    const parsed = parseDotenv(content);
    envVars = { ...envVars, ...parsed };
  }
  
  // Load .env.local file (which is always loaded and overrides everything except .env.*.local)
  const localEnvPath = path.resolve(process.cwd(), `${envPath}.local`);
  if (fs.existsSync(localEnvPath)) {
    const content = fs.readFileSync(localEnvPath, 'utf-8');
    const parsed = parseDotenv(content);
    envVars = { ...envVars, ...parsed };
  }
  
  // Load environment-specific local .env file
  const envSpecificLocalPath = path.resolve(process.cwd(), `${envPath}.${environment}.local`);
  if (fs.existsSync(envSpecificLocalPath)) {
    const content = fs.readFileSync(envSpecificLocalPath, 'utf-8');
    const parsed = parseDotenv(content);
    envVars = { ...envVars, ...parsed };
  }
  
  // Expand variables
  envVars = expandEnv(envVars);
  
  // Set environment variables
  for (const key in envVars) {
    if (override || !process.env[key]) {
      process.env[key] = envVars[key];
    }
  }
  
  // Filter public variables
  const publicVars: Record<string, string> = {};
  for (const key in envVars) {
    if (key.startsWith(publicPrefix)) {
      publicVars[key] = envVars[key];
    }
  }
  
  return publicVars;
}

/**
 * Get the value of an environment variable
 * 
 * @param key - The environment variable key
 * @param defaultValue - Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] !== undefined ? process.env[key] : defaultValue;
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
  
  const num = Number(value);
  
  if (Number.isNaN(num)) {
    return defaultValue;
  }
  
  return num;
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
  
  return value.toLowerCase() === 'true' || value === '1';
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

export default env;
