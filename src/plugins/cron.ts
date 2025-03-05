/**
 * Cron Job Scheduler Plugin for Elysium.js
 * 
 * Provides task scheduling capabilities for recurring tasks
 */

import { Elysia } from 'elysia';

// Simple cron implementation
class SimpleCron {
  private static readonly CRON_REGEX = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
  
  private interval: NodeJS.Timeout | null = null;
  private lastRun: Date = new Date(0);
  private readonly expression: string;
  private readonly callback: () => void;
  private readonly options: { timezone?: string } = {};
  
  constructor(expression: string, callback: () => void, options: { timezone?: string } = {}) {
    this.expression = expression;
    this.callback = callback;
    this.options = options;
  }
  
  public static validate(expression: string): boolean {
    return SimpleCron.CRON_REGEX.test(expression);
  }
  
  private parseExpression(): { minute: number[], hour: number[], day: number[], month: number[], dayOfWeek: number[] } {
    const parts = this.expression.split(' ');
    
    return {
      minute: this.parsePart(parts[0], 0, 59),
      hour: this.parsePart(parts[1], 0, 23),
      day: this.parsePart(parts[2], 1, 31),
      month: this.parsePart(parts[3], 1, 12),
      dayOfWeek: this.parsePart(parts[4], 0, 6),
    };
  }
  
  private parsePart(part: string, min: number, max: number): number[] {
    if (part === '*') {
      return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }
    
    if (part.includes('/')) {
      const [_, step] = part.split('/');
      const stepNum = parseInt(step, 10);
      const result = [];
      for (let i = min; i <= max; i += stepNum) {
        result.push(i);
      }
      return result;
    }
    
    return [parseInt(part, 10)];
  }
  
  private matchesDate(date: Date): boolean {
    const { minute, hour, day, month, dayOfWeek } = this.parseExpression();
    
    return (
      minute.includes(date.getMinutes()) &&
      hour.includes(date.getHours()) &&
      day.includes(date.getDate()) &&
      month.includes(date.getMonth() + 1) &&
      dayOfWeek.includes(date.getDay())
    );
  }
  
  public start(): void {
    if (this.interval) {
      return;
    }
    
    this.interval = setInterval(() => {
      const now = new Date();
      
      // Only run once per minute
      if (now.getMinutes() === this.lastRun.getMinutes() &&
          now.getHours() === this.lastRun.getHours() &&
          now.getDate() === this.lastRun.getDate() &&
          now.getMonth() === this.lastRun.getMonth()) {
        return;
      }
      
      if (this.matchesDate(now)) {
        this.lastRun = now;
        this.callback();
      }
    }, 1000); // Check every second
  }
  
  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Task interface
export interface CronTask {
  name: string;
  schedule: string;
  handler: () => Promise<void> | void;
  options?: {
    timezone?: string;
    runOnInit?: boolean;
  };
}

// Scheduler class
class Scheduler {
  private tasks: Map<string, { task: CronTask, scheduler: SimpleCron }> = new Map();
  
  /**
   * Add a new task to the scheduler
   * 
   * @param task - Task configuration
   * @returns The scheduled task
   */
  public addTask(task: CronTask): { start: () => void; stop: () => void } {
    if (this.tasks.has(task.name)) {
      throw new Error(`Task with name "${task.name}" already exists`);
    }
    
    // Validate cron expression
    if (!SimpleCron.validate(task.schedule)) {
      throw new Error(`Invalid cron expression: ${task.schedule}`);
    }
    
    // Create the scheduled task
    const cronTask = new SimpleCron(
      task.schedule,
      async () => {
        try {
          console.info(`Running scheduled task: ${task.name}`);
          await task.handler();
          console.info(`Completed scheduled task: ${task.name}`);
        } catch (error) {
          console.error(`Error in scheduled task ${task.name}:`, error);
        }
      },
      { timezone: task.options?.timezone }
    );
    
    // Store the task
    this.tasks.set(task.name, { task, scheduler: cronTask });
    
    // Start the task
    cronTask.start();
    
    // Run immediately if configured
    if (task.options?.runOnInit) {
      setTimeout(async () => {
        try {
          console.info(`Running scheduled task on init: ${task.name}`);
          await task.handler();
          console.info(`Completed scheduled task on init: ${task.name}`);
        } catch (error) {
          console.error(`Error in scheduled task on init ${task.name}:`, error);
        }
      }, 0);
    }
    
    return {
      start: () => cronTask.start(),
      stop: () => cronTask.stop(),
    };
  }
  
  /**
   * Remove a task from the scheduler
   * 
   * @param name - Task name
   */
  public removeTask(name: string): void {
    const task = this.tasks.get(name);
    
    if (task) {
      task.scheduler.stop();
      this.tasks.delete(name);
    }
  }
  
  /**
   * Start a task
   * 
   * @param name - Task name
   */
  public startTask(name: string): void {
    const task = this.tasks.get(name);
    
    if (task) {
      task.scheduler.start();
    } else {
      throw new Error(`Task with name "${name}" not found`);
    }
  }
  
  /**
   * Stop a task
   * 
   * @param name - Task name
   */
  public stopTask(name: string): void {
    const task = this.tasks.get(name);
    
    if (task) {
      task.scheduler.stop();
    } else {
      throw new Error(`Task with name "${name}" not found`);
    }
  }
  
  /**
   * Get all tasks
   * 
   * @returns All tasks
   */
  public getTasks(): CronTask[] {
    return Array.from(this.tasks.values()).map(({ task }) => task);
  }
  
  /**
   * Get a task by name
   * 
   * @param name - Task name
   * @returns The task or undefined if not found
   */
  public getTask(name: string): CronTask | undefined {
    const task = this.tasks.get(name);
    return task?.task;
  }
  
  /**
   * Start all tasks
   */
  public startAll(): void {
    for (const { scheduler } of this.tasks.values()) {
      scheduler.start();
    }
  }
  
  /**
   * Stop all tasks
   */
  public stopAll(): void {
    for (const { scheduler } of this.tasks.values()) {
      scheduler.stop();
    }
  }
}

// Create the scheduler instance
export const scheduler = new Scheduler();

/**
 * Cron scheduler plugin for Elysia
 * 
 * @param tasks - Initial tasks to schedule
 * @returns Elysia plugin
 */
export function setupCron(tasks: CronTask[] = []) {
  return new Elysia({ name: 'elysium-cron' })
    .decorate('scheduler', scheduler)
    .on('start', () => {
      // Schedule initial tasks
      for (const task of tasks) {
        scheduler.addTask(task);
      }
    })
    .on('stop', () => {
      // Stop all tasks
      scheduler.stopAll();
    });
}

export default { setupCron, scheduler };
