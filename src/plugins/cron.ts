/**
 * Cron Job Scheduler Plugin for Elysium.js
 * 
 * Provides task scheduling capabilities using node-cron
 */

import { Elysia } from 'elysia';
import cron from 'node-cron';
import { logger } from './logger';

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
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  
  /**
   * Add a new task to the scheduler
   * 
   * @param task - Task configuration
   * @returns The scheduled task
   */
  public addTask(task: CronTask): cron.ScheduledTask {
    if (this.tasks.has(task.name)) {
      throw new Error(`Task with name "${task.name}" already exists`);
    }
    
    // Validate cron expression
    if (!cron.validate(task.schedule)) {
      throw new Error(`Invalid cron expression: ${task.schedule}`);
    }
    
    // Create the scheduled task
    const scheduledTask = cron.schedule(
      task.schedule,
      async () => {
        try {
          logger.info(`Running scheduled task: ${task.name}`);
          await task.handler();
          logger.info(`Completed scheduled task: ${task.name}`);
        } catch (error) {
          logger.error(`Error in scheduled task ${task.name}:`, error);
        }
      },
      {
        scheduled: true,
        timezone: task.options?.timezone,
      }
    );
    
    // Store the task
    this.tasks.set(task.name, scheduledTask);
    
    // Run immediately if runOnInit is true
    if (task.options?.runOnInit) {
      try {
        logger.info(`Running task ${task.name} on initialization`);
        task.handler();
      } catch (error) {
        logger.error(`Error running task ${task.name} on initialization:`, error);
      }
    }
    
    return scheduledTask;
  }
  
  /**
   * Get a scheduled task by name
   * 
   * @param name - Task name
   * @returns The scheduled task or undefined if not found
   */
  public getTask(name: string): cron.ScheduledTask | undefined {
    return this.tasks.get(name);
  }
  
  /**
   * Start a task by name
   * 
   * @param name - Task name
   * @returns True if the task was started, false if not found
   */
  public startTask(name: string): boolean {
    const task = this.tasks.get(name);
    
    if (task) {
      task.start();
      logger.info(`Started scheduled task: ${name}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Stop a task by name
   * 
   * @param name - Task name
   * @returns True if the task was stopped, false if not found
   */
  public stopTask(name: string): boolean {
    const task = this.tasks.get(name);
    
    if (task) {
      task.stop();
      logger.info(`Stopped scheduled task: ${name}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Remove a task by name
   * 
   * @param name - Task name
   * @returns True if the task was removed, false if not found
   */
  public removeTask(name: string): boolean {
    const task = this.tasks.get(name);
    
    if (task) {
      task.stop();
      this.tasks.delete(name);
      logger.info(`Removed scheduled task: ${name}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all scheduled tasks
   * 
   * @returns Map of all tasks
   */
  public getAllTasks(): Map<string, cron.ScheduledTask> {
    return this.tasks;
  }
  
  /**
   * Start all tasks
   */
  public startAll(): void {
    this.tasks.forEach((task, name) => {
      task.start();
      logger.info(`Started scheduled task: ${name}`);
    });
  }
  
  /**
   * Stop all tasks
   */
  public stopAll(): void {
    this.tasks.forEach((task, name) => {
      task.stop();
      logger.info(`Stopped scheduled task: ${name}`);
    });
  }
}

// Create the scheduler instance
export const scheduler = new Scheduler();

/**
 * Cron scheduler plugin for Elysia
 */
export function setupCron(tasks: CronTask[] = []) {
  return (app: Elysia) => {
    // Register tasks
    tasks.forEach(task => {
      scheduler.addTask(task);
    });
    
    // Add scheduler to app state
    app = app.state('scheduler', scheduler);
    
    return app;
  };
}

export default { setupCron, scheduler };
