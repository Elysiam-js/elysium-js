/**
 * Logger Plugin for Elysium.js
 * 
 * Provides a structured logging system for your Elysium.js application
 */

import { Elysia } from 'elysia';

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
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, ...args);
    }
  }
  
  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, ...args);
    }
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, ...args);
    }
  }
  
  /**
   * Log an error message
   */
  error(message: string | Error, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMessage = message instanceof Error ? message.stack || message.message : message;
      this.log(LogLevel.ERROR, errorMessage, ...args);
    }
  }
  
  /**
   * Create a child logger with a different prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      level: this.level,
      prefix: `${this.prefix}:${prefix}`,
      timestamp: this.timestamp,
      colorize: this.colorize,
      logToFile: this.logToFile,
      logFilePath: this.logFilePath,
    });
  }
  
  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
  
  /**
   * Format and log a message
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = this.timestamp ? `[${new Date().toISOString()}]` : '';
    const prefix = `[${this.prefix}]`;
    const levelStr = `[${level.toUpperCase()}]`;
    
    let formattedMessage = `${timestamp} ${prefix} ${levelStr} ${message}`;
    
    if (args.length > 0) {
      formattedMessage += ` ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : arg
      ).join(' ')}`;
    }
    
    if (this.colorize) {
      formattedMessage = this.colorizeMessage(level, formattedMessage);
    }
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
    
    if (this.logToFile) {
      this.writeToFile(formattedMessage);
    }
  }
  
  /**
   * Colorize a log message
   */
  private colorizeMessage(level: LogLevel, message: string): string {
    switch (level) {
      case LogLevel.DEBUG:
        return `\x1b[34m${message}\x1b[0m`; // Blue
      case LogLevel.INFO:
        return `\x1b[32m${message}\x1b[0m`; // Green
      case LogLevel.WARN:
        return `\x1b[33m${message}\x1b[0m`; // Yellow
      case LogLevel.ERROR:
        return `\x1b[31m${message}\x1b[0m`; // Red
      default:
        return message;
    }
  }
  
  /**
   * Write a log message to a file
   */
  private writeToFile(message: string): void {
    // In a real implementation, this would write to a file
    // For simplicity, we're just logging to console
    console.log(`[FILE LOG] ${message}`);
  }
}

/**
 * Create a logger middleware for Elysia
 */
export function loggerMiddleware(options: LoggerOptions = {}) {
  const logger = new Logger(options);
  
  return (app: Elysia) => 
    app.onRequest(({ request }) => {
      logger.info(`${request.method} ${request.url}`);
    })
    .onResponse(({ request, response }) => {
      logger.info(`${request.method} ${request.url} - ${response.status}`);
    })
    .onError(({ request, error }) => {
      logger.error(`${request.method} ${request.url} - ${error.message}`, error);
    });
}

/**
 * Default logger instance
 */
export const logger = new Logger();

export default { Logger, loggerMiddleware, logger };
