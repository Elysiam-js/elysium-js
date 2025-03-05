import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';
import { autoRouter } from './utils/autoRouter';
import { elsProcessor } from './utils/elsProcessor';
import { setupSwagger } from './plugins/swagger';
import { setupCors } from './plugins/cors';
import { logger, loggerMiddleware } from './plugins/logger';
import { env } from './plugins/env';
import { http } from './plugins/http';
import { errorHandler, error } from './plugins/errors';
import { responseFormatter } from './plugins/response';
import { jwtAuth } from './plugins/auth';
import { setupCron } from './plugins/cron';
import { setupOrm, OrmType } from './plugins/orm';

// Load environment variables
const publicEnv = env.load();

// Create Elysium application
export function createElysium(options: {
  routesDir?: string;
  staticDir?: string;
  port?: number;
  swagger?: boolean;
  cors?: boolean;
  logging?: boolean;
  standardResponses?: boolean;
  auth?: boolean;
  cron?: boolean;
  orm?: {
    type: OrmType;
    config?: any;
  };
} = {}) {
  const {
    routesDir = './app/routes',
    staticDir = './app/static',
    port = 3000,
    swagger = true,
    cors = true,
    logging = true,
    standardResponses = true,
    auth = false,
    cron = false,
    orm,
  } = options;

  // Create Elysia app
  let app = new Elysia();

  // Add HTML support
  app = app.use(html());

  // Add static file serving
  app = app.use(staticPlugin({ assets: staticDir }));

  // Add error handler
  app = app.use(errorHandler());

  // Add standard response formatter if enabled
  if (standardResponses) {
    app = app.use(responseFormatter());
  }

  // Add CORS if enabled
  if (cors) {
    app = setupCors(app);
  }

  // Add logger if enabled
  if (logging) {
    app = app.use(loggerMiddleware());
  }

  // Add Swagger if enabled
  if (swagger) {
    app = setupSwagger(app);
  }

  // Add JWT authentication if enabled
  if (auth) {
    app = app.use(jwtAuth());
  }

  // Add cron scheduler if enabled
  if (cron) {
    app = app.use(setupCron());
  }

  // Add ORM if configured
  if (orm) {
    // This will be set up asynchronously after app initialization
    setupOrm(orm.type, orm.config).then(ormPlugin => {
      app = app.use(ormPlugin);
      logger.info(`ORM (${orm.type}) initialized and attached to app`);
    }).catch(err => {
      logger.error(`Failed to initialize ORM (${orm.type}):`, err);
    });
  }

  // Add public environment variables to global context
  app = app.state('env', publicEnv);
  
  // Add HTTP client to global context
  app = app.state('http', http);
  
  // Add error utilities to global context
  app = app.state('error', error);

  // Add auto router
  app = autoRouter(app, {
    dir: routesDir,
    processors: {
      '.els': elsProcessor
    }
  });

  // Start the server if not in development mode
  if (process.env.NODE_ENV !== 'development') {
    app.listen(port);
    logger.info(`🚀 Elysium server is running at http://localhost:${port}`);
  }

  return app;
}

// Export plugins and utilities
export * from './elysium';
export * from './utils/autoRouter';
export * from './utils/elsProcessor';
export * from './plugins/swagger';
export * from './plugins/cors';
export * from './plugins/logger';
export * from './plugins/env';
export * from './plugins/http';
export * from './plugins/errors';
export * from './plugins/response';
export * from './plugins/auth';
export * from './plugins/cron';
export * from './plugins/orm';

// Default export
export default createElysium;
