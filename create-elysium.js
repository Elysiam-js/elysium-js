#!/usr/bin/env bun

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('\n🌟 Welcome to Elysium.js Project Creator 🌟\n');
  
  // Get project name
  const args = process.argv.slice(2);
  let projectName = args[0];
  
  if (!projectName) {
    projectName = await question('Enter project name: ');
    if (!projectName) {
      console.error('❌ Project name is required');
      rl.close();
      return;
    }
  }
  
  const projectPath = path.resolve(process.cwd(), projectName);
  
  // Check if directory already exists
  if (fs.existsSync(projectPath)) {
    const overwrite = await question(`Directory ${projectName} already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Operation cancelled');
      rl.close();
      return;
    }
    fs.rmSync(projectPath, { recursive: true, force: true });
  }
  
  console.log(`\nCreating a new Elysium.js project in ${projectPath}...\n`);
  
  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });
  
  // Database options
  console.log('📊 Database Options:');
  const ormOptions = ['turso', 'prisma', 'drizzle', 'none'];
  ormOptions.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option.charAt(0).toUpperCase() + option.slice(1)}`);
  });
  
  const ormChoice = await question('Select ORM (1-4): ');
  const selectedOrm = ormOptions[parseInt(ormChoice) - 1] || 'none';
  
  // Styling options
  console.log('\n🎨 Styling Options:');
  const useTailwind = (await question('Use Tailwind CSS? (Y/n): ')).toLowerCase() !== 'n';
  
  // Code quality tools
  console.log('\n🔍 Code Quality Tools:');
  const usePrettier = (await question('Use Prettier? (Y/n): ')).toLowerCase() !== 'n';
  const useEslint = (await question('Use ESLint? (Y/n): ')).toLowerCase() !== 'n';
  
  // API features
  console.log('\n🚀 API Features:');
  const useWebSockets = (await question('Add WebSockets support? (y/N): ')).toLowerCase() === 'y';
  const useGraphQL = (await question('Add GraphQL support? (y/N): ')).toLowerCase() === 'y';
  const useCron = (await question('Add Task Scheduling (Cron)? (y/N): ')).toLowerCase() === 'y';
  const useSwagger = (await question('Add Swagger documentation? (Y/n): ')).toLowerCase() !== 'n';
  const useJwt = (await question('Add JWT Authentication? (y/N): ')).toLowerCase() === 'y';
  
  // Clone the template repository
  console.log('\n📦 Setting up project...');
  
  try {
    // Clone the repository
    execSync('git clone --depth=1 https://github.com/Elysiam-js/elysium-js.git .', {
      cwd: projectPath,
      stdio: 'ignore'
    });
    
    // Remove .git directory
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });
    
    // Create configuration
    const config = {
      name: projectName,
      orm: selectedOrm,
      tailwind: useTailwind,
      prettier: usePrettier,
      eslint: useEslint,
      websockets: useWebSockets,
      graphql: useGraphQL,
      cron: useCron,
      swagger: useSwagger,
      jwt: useJwt
    };
    
    // Write configuration to file
    fs.writeFileSync(
      path.join(projectPath, 'elysium.config.json'),
      JSON.stringify(config, null, 2)
    );
    
    // Initialize new git repository
    execSync('git init', {
      cwd: projectPath,
      stdio: 'ignore'
    });
    
    // Create initial commit
    execSync('git add .', {
      cwd: projectPath,
      stdio: 'ignore'
    });
    
    execSync('git commit -m "Initial commit from Elysium.js"', {
      cwd: projectPath,
      stdio: 'ignore'
    });
    
    // Install dependencies
    console.log('📥 Installing dependencies...');
    execSync('bun install', {
      cwd: projectPath,
      stdio: 'inherit'
    });
    
    // Set up ORM if selected
    if (selectedOrm !== 'none') {
      console.log(`🔄 Setting up ${selectedOrm}...`);
      
      if (selectedOrm === 'prisma') {
        // Initialize Prisma
        fs.mkdirSync(path.join(projectPath, 'prisma'), { recursive: true });
        fs.writeFileSync(
          path.join(projectPath, 'prisma', 'schema.prisma'),
          `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`
        );
        
        // Create .env file with DATABASE_URL
        fs.writeFileSync(
          path.join(projectPath, '.env'),
          'DATABASE_URL="file:./dev.db"\n'
        );
        
        // Install Prisma dependencies
        execSync('bun add -d prisma && bun add @prisma/client', {
          cwd: projectPath,
          stdio: 'inherit'
        });
        
        // Generate Prisma client
        execSync('bunx prisma generate', {
          cwd: projectPath,
          stdio: 'inherit'
        });
      } else if (selectedOrm === 'drizzle') {
        // Initialize Drizzle
        fs.mkdirSync(path.join(projectPath, 'db'), { recursive: true });
        fs.writeFileSync(
          path.join(projectPath, 'db', 'schema.ts'),
          `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name')
});`
        );
        
        // Create .env file with DATABASE_URL
        fs.writeFileSync(
          path.join(projectPath, '.env'),
          'DATABASE_URL="file:./data.db"\n'
        );
        
        // Install Drizzle dependencies
        execSync('bun add drizzle-orm @libsql/client && bun add -d drizzle-kit', {
          cwd: projectPath,
          stdio: 'inherit'
        });
      } else if (selectedOrm === 'turso') {
        // Initialize Turso
        fs.mkdirSync(path.join(projectPath, 'db'), { recursive: true });
        
        // Create .env file with DATABASE_URL
        fs.writeFileSync(
          path.join(projectPath, '.env'),
          'DATABASE_URL="file:./data.db"\n'
        );
        
        // Install Turso dependencies
        execSync('bun add @libsql/client', {
          cwd: projectPath,
          stdio: 'inherit'
        });
      }
    }
    
    // Set up Tailwind if selected
    if (useTailwind) {
      console.log('🎨 Setting up Tailwind CSS...');
      
      // Install Tailwind dependencies
      execSync('bun add -d tailwindcss postcss autoprefixer', {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      // Create Tailwind config
      execSync('bunx tailwindcss init -p', {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      // Update tailwind.config.js
      fs.writeFileSync(
        path.join(projectPath, 'tailwind.config.js'),
        `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{els,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
      );
      
      // Create CSS file
      fs.mkdirSync(path.join(projectPath, 'app', 'static', 'css'), { recursive: true });
      fs.writeFileSync(
        path.join(projectPath, 'app', 'static', 'css', 'tailwind.css'),
        `@tailwind base;
@tailwind components;
@tailwind utilities;`
      );
    }
    
    // Set up Prettier if selected
    if (usePrettier) {
      console.log('🔍 Setting up Prettier...');
      
      // Install Prettier dependencies
      execSync('bun add -d prettier', {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      // Create Prettier config
      fs.writeFileSync(
        path.join(projectPath, '.prettierrc'),
        `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}`
      );
      
      // Create Prettier ignore file
      fs.writeFileSync(
        path.join(projectPath, '.prettierignore'),
        `dist
node_modules
.DS_Store`
      );
    }
    
    // Set up ESLint if selected
    if (useEslint) {
      console.log('🔍 Setting up ESLint...');
      
      // Install ESLint dependencies
      execSync('bun add -d eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser', {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      // Create ESLint config
      fs.writeFileSync(
        path.join(projectPath, '.eslintrc.js'),
        `module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Custom rules
  },
};`
      );
      
      // Create ESLint ignore file
      fs.writeFileSync(
        path.join(projectPath, '.eslintignore'),
        `dist
node_modules
.DS_Store`
      );
    }
    
    // Set up additional features
    if (useWebSockets) {
      console.log('🔄 Setting up WebSockets...');
      execSync('bun add @elysiajs/websocket', {
        cwd: projectPath,
        stdio: 'inherit'
      });
    }
    
    if (useGraphQL) {
      console.log('🔄 Setting up GraphQL...');
      execSync('bun add @elysiajs/graphql graphql', {
        cwd: projectPath,
        stdio: 'inherit'
      });
    }
    
    // Update package.json scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.scripts = {
      dev: 'bun run --watch src/index.ts',
      start: 'bun run src/index.ts',
      build: 'bun build src/index.ts --outdir dist',
      ...packageJson.scripts
    };
    
    if (useEslint) {
      packageJson.scripts.lint = 'eslint . --ext .ts';
    }
    
    if (usePrettier) {
      packageJson.scripts.format = 'prettier --write "**/*.{ts,els,js,json}"';
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Create main application file with selected options
    const appConfigOptions = [];
    
    if (selectedOrm !== 'none') {
      appConfigOptions.push(`  orm: {
    type: '${selectedOrm}',
    config: {}
  }`);
    }
    
    if (useSwagger) {
      appConfigOptions.push('  swagger: true');
    }
    
    if (useJwt) {
      appConfigOptions.push('  auth: true');
    }
    
    if (useCron) {
      appConfigOptions.push('  cron: true');
    }
    
    // Create app.ts with configuration
    fs.writeFileSync(
      path.join(projectPath, 'src', 'app.ts'),
      `import { createElysium } from './index';

// Create Elysium application
const app = createElysium({
${appConfigOptions.join(',\n')}
});

export default app;`
    );
    
    console.log('\n✅ Project setup complete!');
    console.log('\nNext steps:');
    console.log(`  1. cd ${projectName}`);
    console.log('  2. bun dev');
    console.log('\nHappy coding! 🚀');
    
  } catch (error) {
    console.error('❌ Error setting up project:', error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
