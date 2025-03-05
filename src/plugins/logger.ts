/**
 * Logger Plugin for Elysium.js
 * 
 * Provides a structured logging system for your Elysium.js application
 */

import { Elysia } from 'elysia';
import fs from 'fs';
import path from 'path';

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colorize?: boolean;
  logToFile?: boolean;
  logFilePath?: string;
}

/**
 * Logger class for Elysium.js
 */
export class Logger {
  private level: LogLevel;
  private prefix: string;
  private timestamp: boolean;
  private colorize: boolean;
  private logToFile: boolean;
  private logFilePath: string;
  
  constructor(options: LoggerOptions = {}) {
    this.level = options.level || LogLevel.INFO;
    this.prefix = options.prefix || 'Elysium';
    this.timestamp = options.timestamp !== false;
    this.colorize = options.colorize !== false;
    this.logToFile = options.logToFile || false;
    this.logFilePath = options.logFilePath || './logs/elysium.log';
  }
  
  /**
   * Set the log level
   * 
   * @param level - Log level
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Get the current log level
   * 
   * @returns Current log level
   */
  public getLevel(): LogLevel {
    return this.level;
  }
  
  /**
   * Check if a log level is enabled
   * 
   * @param level - Log level to check
   * @returns True if the log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(level);
    
    return targetLevelIndex >= currentLevelIndex;
  }
  
  /**
   * Format a log message
   * 
   * @param level - Log level
   * @param message - Log message
   * @param args - Additional arguments
   * @returns Formatted log message
   */
  private formatMessage(level: LogLevel, message: string, args: any[]): string {
    let formattedMessage = '';
    
    // Add timestamp if enabled
    if (this.timestamp) {
      formattedMessage += `[${new Date().toISOString()}] `;
    }
    
    // Add prefix and level
    formattedMessage += `[${this.prefix}] [${level.toUpperCase()}] `;
    
    // Add message
    formattedMessage += message;
    
    // Add additional arguments
    if (args.length > 0) {
      formattedMessage += ' ' + args.map(arg => {
        if (arg instanceof Error) {
          return arg.stack || arg.message;
        } else if (typeof arg === 'object') {
          return JSON.stringify(arg);
        } else {
          return String(arg);
        }
      }).join(' ');
    }
    
    return formattedMessage;
  }
  
  /**
   * Write a log message to a file
   * 
   * @param message - Log message
   */
  private writeToFile(message: string): void {
    if (!this.logToFile) {
      return;
    }
    
    try {
      // Create directory if it doesn't exist
      const dir = path.dirname(this.logFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Append message to file
      fs.appendFileSync(this.logFilePath, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }
  
  /**
   * Log a debug message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  public debug(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.DEBUG)) {
      return;
    }
    
    const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, args);
    
    if (this.colorize) {
      console.debug('\x1b[90m' + formattedMessage + '\x1b[0m');
    } else {
      console.debug(formattedMessage);
    }
    
    this.writeToFile(formattedMessage);
  }
  
  /**
   * Log an info message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  public info(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.INFO)) {
      return;
    }
    
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, args);
    
    if (this.colorize) {
      console.info('\x1b[32m' + formattedMessage + '\x1b[0m');
    } else {
      console.info(formattedMessage);
    }
    
    this.writeToFile(formattedMessage);
  }
  
  /**
   * Log a warning message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  public warn(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.WARN)) {
      return;
    }
    
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, args);
    
    if (this.colorize) {
      console.warn('\x1b[33m' + formattedMessage + '\x1b[0m');
    } else {
      console.warn(formattedMessage);
    }
    
    this.writeToFile(formattedMessage);
  }
  
  /**
   * Log an error message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  public error(message: string, ...args: any[]): void {
    if (!this.isLevelEnabled(LogLevel.ERROR)) {
      return;
    }
    
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, args);
    
    if (this.colorize) {
      console.error('\x1b[31m' + formattedMessage + '\x1b[0m');
    } else {
      console.error(formattedMessage);
    }
    
    this.writeToFile(formattedMessage);
  }
}

/**
 * Create a logger middleware for Elysia
 * 
 * @param options - Logger options
 * @returns Elysia middleware
 */
export function loggerMiddleware(options: LoggerOptions = {}) {
  const loggerInstance = new Logger(options);
  
  return new Elysia({ name: 'elysium-logger' })
    .onRequest(({ request }) => {
      const startTime = Date.now();
      request.startTime = startTime;
    })
    .onResponse(({ request, response }) => {
      const endTime = Date.now();
      const duration = endTime - (request.startTime || endTime);
      
      loggerInstance.info(
        `${request.method} ${request.url} - ${response.status} - ${duration}ms`
      );
    })
    .onError(({ error, request }) => {
      loggerInstance.error(
        `${request.method} ${request.url} - ${error.message}`,
        error
      );
    });
}

/**
 * Default logger instance
 */
export const logger = new Logger();

export default { Logger, loggerMiddleware, logger };
