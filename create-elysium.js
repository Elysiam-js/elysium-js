#!/usr/bin/env bun

import { $ } from 'bun';
import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => readline.question(query, resolve));

async function main() {
  console.log('🚀 Welcome to Elysium.js Project Creator 🚀');
  console.log('------------------------------------------');
  
  // Get project name
  const projectName = process.argv[2] || await question('Project name: ');
  if (!projectName) {
    console.error('❌ Project name is required');
    process.exit(1);
  }
  
  const projectPath = path.join(process.cwd(), projectName);
  
  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    const overwrite = await question(`Directory ${projectName} already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Operation cancelled');
      process.exit(0);
    }
  }
  
  // Create project directory
  fs.mkdirSync(projectPath, { recursive: true });
  
  // Ask for ORM
  console.log('\nSelect ORM:');
  console.log('1. Turso (default)');
  console.log('2. Prisma');
  console.log('3. Drizzle');
  const ormChoice = await question('Choice (1-3): ');
  
  let orm = 'turso';
  switch (ormChoice) {
    case '2':
      orm = 'prisma';
      break;
    case '3':
      orm = 'drizzle';
      break;
    default:
      orm = 'turso';
  }
  
  // Ask for Tailwind
  const useTailwind = (await question('Use Tailwind CSS? (Y/n): ')).toLowerCase() !== 'n';
  
  console.log(`\nCreating Elysium.js project in ${projectPath}`);
  console.log(`ORM: ${orm}`);
  console.log(`Tailwind: ${useTailwind ? 'Yes' : 'No'}`);
  
  // Clone the template repository
  console.log('\n📦 Cloning template...');
  try {
    await $`git clone --depth 1 https://github.com/yourusername/elysium-js-template.git ${projectPath} && rm -rf ${path.join(projectPath, '.git')}`;
  } catch (error) {
    console.error('❌ Failed to clone template:', error);
    process.exit(1);
  }
  
  // Configure ORM
  console.log('🔧 Configuring ORM...');
  try {
    if (orm === 'prisma') {
      await $`cd ${projectPath} && bun add -d prisma && bunx prisma init`;
    } else if (orm === 'drizzle') {
      await $`cd ${projectPath} && bun add drizzle-orm drizzle-kit`;
    }
  } catch (error) {
    console.error('❌ Failed to configure ORM:', error);
  }
  
  // Configure Tailwind if needed
  if (useTailwind) {
    console.log('🎨 Setting up Tailwind CSS...');
    try {
      await $`cd ${projectPath} && bun add -d tailwindcss postcss autoprefixer && bunx tailwindcss init -p`;
    } catch (error) {
      console.error('❌ Failed to set up Tailwind:', error);
    }
  }
  
  // Install dependencies
  console.log('📚 Installing dependencies...');
  try {
    await $`cd ${projectPath} && bun install`;
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error);
  }
  
  console.log('\n✅ Project created successfully!');
  console.log(`\nTo get started, run the following commands:`);
  console.log(`  cd ${projectName}`);
  console.log('  bun run dev');
  
  readline.close();
}

main().catch(console.error);
