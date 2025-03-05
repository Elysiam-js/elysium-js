# Task Scheduling in Elysium.js

Elysium.js provides a powerful task scheduling system based on node-cron, allowing you to run recurring tasks at specified intervals.

## Setup

Task scheduling is disabled by default. To enable it, set the `cron` option to `true` when creating your Elysium application:

```typescript
import { createElysium } from 'elysium-js';

const app = createElysium({
  cron: true
});
```

## Defining Tasks

You can define scheduled tasks using the `scheduler` object:

```typescript
import { createElysium, scheduler } from 'elysium-js';

const app = createElysium({
  cron: true
});

// Add a task that runs every minute
scheduler.addTask({
  name: 'minuteTask',
  schedule: '* * * * *',
  handler: async () => {
    console.log('This task runs every minute');
  }
});

// Add a task that runs every day at midnight
scheduler.addTask({
  name: 'dailyTask',
  schedule: '0 0 * * *',
  handler: async () => {
    console.log('This task runs every day at midnight');
  },
  options: {
    timezone: 'America/New_York'
  }
});
```

## Cron Expressions

Task schedules are defined using cron expressions:

| Field        | Value                              | Wildcards        |
|--------------|------------------------------------|--------------------|
| Minute       | 0-59                               | * , - /           |
| Hour         | 0-23                               | * , - /           |
| Day of Month | 1-31                               | * , - / ? L W     |
| Month        | 1-12 or JAN-DEC                    | * , - /           |
| Day of Week  | 0-6 or SUN-SAT                     | * , - / ? L #     |

### Examples

- `* * * * *`: Every minute
- `0 * * * *`: Every hour at minute 0
- `0 0 * * *`: Every day at midnight
- `0 0 * * MON`: Every Monday at midnight
- `0 0 1 * *`: First day of every month at midnight
- `0 0 1 JAN *`: January 1st at midnight (once a year)
- `0 12 * * MON-FRI`: Weekdays at noon
- `*/15 * * * *`: Every 15 minutes

## Task Management

The scheduler provides methods to manage your tasks:

### Starting and Stopping Tasks

```typescript
// Start a specific task
scheduler.startTask('minuteTask');

// Stop a specific task
scheduler.stopTask('minuteTask');

// Start all tasks
scheduler.startAll();

// Stop all tasks
scheduler.stopAll();
```

### Removing Tasks

```typescript
// Remove a task
scheduler.removeTask('minuteTask');
```

### Getting Task Information

```typescript
// Get a specific task
const task = scheduler.getTask('minuteTask');

// Get all tasks
const allTasks = scheduler.getAllTasks();
```

## Running Tasks on Initialization

You can configure a task to run immediately when it's added by setting the `runOnInit` option:

```typescript
scheduler.addTask({
  name: 'immediateTask',
  schedule: '0 0 * * *',
  handler: async () => {
    console.log('This task runs immediately and then daily');
  },
  options: {
    runOnInit: true
  }
});
```

## Timezone Support

You can specify a timezone for your tasks using the `timezone` option:

```typescript
scheduler.addTask({
  name: 'timezoneTask',
  schedule: '0 9 * * *',
  handler: async () => {
    console.log('This task runs at 9 AM in Tokyo');
  },
  options: {
    timezone: 'Asia/Tokyo'
  }
});
```

## Error Handling

Errors in task handlers are automatically caught and logged, preventing them from crashing your application:

```typescript
scheduler.addTask({
  name: 'errorTask',
  schedule: '* * * * *',
  handler: async () => {
    // This error will be caught and logged
    throw new Error('Task failed');
  }
});
```

## Using Tasks in Routes

You can also access the scheduler in your route handlers:

```typescript
import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.group('/api/tasks', (app) =>
    app
      .get('/', ({ scheduler, success }) => {
        const tasks = Array.from(scheduler.getAllTasks().keys());
        return success(tasks, 'Tasks retrieved successfully');
      })
      .post('/start/:name', ({ params, scheduler, success, error }) => {
        const { name } = params;
        
        if (scheduler.startTask(name)) {
          return success({ name }, 'Task started successfully');
        }
        
        throw error.NotFound(`Task "${name}" not found`);
      })
      .post('/stop/:name', ({ params, scheduler, success, error }) => {
        const { name } = params;
        
        if (scheduler.stopTask(name)) {
          return success({ name }, 'Task stopped successfully');
        }
        
        throw error.NotFound(`Task "${name}" not found`);
      })
  );
```

## Best Practices

1. **Unique Task Names**: Always use unique names for your tasks to avoid conflicts.
2. **Asynchronous Handlers**: Use async/await in your task handlers for better error handling.
3. **Resource Management**: Be mindful of resource usage in frequently running tasks.
4. **Logging**: Log the start and completion of tasks for monitoring purposes.
5. **Timezone Awareness**: Specify timezones explicitly when working with time-sensitive tasks.
