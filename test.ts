// Simple test file to verify our changes
import { env, http, logger } from './src/index';

async function runTests() {
  try {
    // Test environment variables
    console.log('Testing env plugin:');
    env.load();
    const testEnv = env.get('NODE_ENV') || 'development';
    console.log(`Current environment: ${testEnv}`);

    // Test HTTP client
    console.log('\nTesting HTTP client:');
    const client = http.createHttpClient();
    console.log('HTTP client created successfully');

    // Test logger
    console.log('\nTesting logger:');
    logger.info('This is an info message');
    logger.warn('This is a warning message');
    logger.error('This is an error message');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
