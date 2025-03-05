#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { join, resolve } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Create readline interface for user input
const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask a question and return the answer
const question = (query) => new Promise((resolve) => readline.question(query, resolve));

// Main function to create a new Elysium project
async function createElysiumProject() {
  console.log('\n🌟 Welcome to Elysium.js Project Creator! 🌟\n');
  
  // Get project name
  const projectName = process.argv[2] || await question('📝 Enter project name: ');
  
  if (!projectName) {
    console.error('❌ Project name is required');
    process.exit(1);
  }
  
  const projectPath = resolve(process.cwd(), projectName);
  
  // Check if directory already exists
  if (existsSync(projectPath)) {
    const overwrite = await question('⚠️ Directory already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('🛑 Operation cancelled');
      process.exit(0);
    }
  }
  
  console.log(`\n📁 Creating new Elysium.js project in ${projectPath}...\n`);
  
  // Create project directory
  if (!existsSync(projectPath)) {
    mkdirSync(projectPath, { recursive: true });
  }
  
  // Ask for project options
  const orm = await question('🗄️ Select ORM (turso, prisma, drizzle, none): ');
  const useTailwind = (await question('🎨 Use Tailwind CSS? (Y/n): ')).toLowerCase() !== 'n';
  const usePrettier = (await question('✨ Use Prettier? (Y/n): ')).toLowerCase() !== 'n';
  const useEslint = (await question('🧹 Use ESLint? (Y/n): ')).toLowerCase() !== 'n';
  const useWebSockets = (await question('🔌 Add WebSockets support? (y/N): ')).toLowerCase() === 'y';
  const useGraphQL = (await question('📊 Add GraphQL support? (y/N): ')).toLowerCase() === 'y';
  const useScheduler = (await question('⏰ Add Task Scheduler? (y/N): ')).toLowerCase() === 'y';
  const useSwagger = (await question('📚 Add Swagger documentation? (y/N): ')).toLowerCase() === 'y';
  
  // Create package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'bun run --watch src/index.ts',
      start: 'NODE_ENV=production bun run src/index.ts',
      build: 'bun build src/index.ts --outdir ./dist',
      test: 'bun test'
    },
    dependencies: {
      'elysia': 'latest',
      '@elysiajs/html': 'latest',
      '@elysiajs/static': 'latest',
      'elysium-js': 'latest',
      'htmx.org': 'latest',
      'dotenv': 'latest',
      'dotenv-expand': 'latest',
      'axios': 'latest'
    },
    devDependencies: {
      'bun-types': 'latest',
      'typescript': 'latest'
    }
  };
  
  // Add ORM dependencies
  if (orm === 'turso') {
    packageJson.dependencies['@libsql/client'] = 'latest';
    packageJson.dependencies['drizzle-orm'] = 'latest';
    packageJson.devDependencies['drizzle-kit'] = 'latest';
  } else if (orm === 'prisma') {
    packageJson.devDependencies['prisma'] = 'latest';
    packageJson.dependencies['@prisma/client'] = 'latest';
  } else if (orm === 'drizzle') {
    packageJson.dependencies['drizzle-orm'] = 'latest';
    packageJson.dependencies['postgres'] = 'latest';
    packageJson.devDependencies['drizzle-kit'] = 'latest';
  }
  
  // Add Tailwind dependencies
  if (useTailwind) {
    packageJson.devDependencies['tailwindcss'] = 'latest';
    packageJson.devDependencies['postcss'] = 'latest';
    packageJson.devDependencies['autoprefixer'] = 'latest';
  }
  
  // Add Prettier dependencies
  if (usePrettier) {
    packageJson.devDependencies['prettier'] = 'latest';
    packageJson.scripts.format = 'prettier --write "src/**/*.{ts,tsx,els}"';
  }
  
  // Add ESLint dependencies
  if (useEslint) {
    packageJson.devDependencies['eslint'] = 'latest';
    packageJson.devDependencies['@typescript-eslint/eslint-plugin'] = 'latest';
    packageJson.devDependencies['@typescript-eslint/parser'] = 'latest';
    packageJson.scripts.lint = 'eslint "src/**/*.{ts,tsx,els}"';
  }
  
  // Add WebSockets dependencies
  if (useWebSockets) {
    packageJson.dependencies['@elysiajs/websocket'] = 'latest';
  }
  
  // Add GraphQL dependencies
  if (useGraphQL) {
    packageJson.dependencies['@elysiajs/graphql'] = 'latest';
    packageJson.dependencies['graphql'] = 'latest';
  }
  
  // Add Scheduler dependencies
  if (useScheduler) {
    packageJson.dependencies['node-cron'] = 'latest';
  }
  
  // Add Swagger dependencies
  if (useSwagger) {
    packageJson.dependencies['@elysiajs/swagger'] = 'latest';
  }
  
  // Write package.json
  writeFileSync(
    join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      jsx: 'react-jsx',
      jsxImportSource: 'elysia/jsx',
      types: ['bun-types']
    },
    include: ['src/**/*', 'app/**/*'],
    exclude: ['node_modules']
  };
  
  writeFileSync(
    join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
  
  // Create project structure
  const directories = [
    'src',
    'app',
    'app/routes',
    'app/components',
    'app/static',
    'app/utils',
  ];
  
  directories.forEach(dir => {
    mkdirSync(join(projectPath, dir), { recursive: true });
  });
  
  // Create .env file
  writeFileSync(
    join(projectPath, '.env'),
    `PORT=3000
NODE_ENV=development
PUBLIC_APP_NAME=${projectName}
`
  );
  
  // Create .gitignore
  writeFileSync(
    join(projectPath, '.gitignore'),
    `node_modules
.env
.env.local
dist
.DS_Store
*.log
`
  );
  
  // Create index.ts
  const indexContent = `import { createElysium } from 'elysium-js';

// Create and start the Elysium application
const app = createElysium({
  port: Number(process.env.PORT) || 3000,
  swagger: ${useSwagger},
  cors: true,
  logging: true
});

export type App = typeof app;
`;
  
  writeFileSync(join(projectPath, 'src/index.ts'), indexContent);
  
  // Create home page component
  const homePageContent = `<script>
  import { onMount } from 'elysium-js';
  
  onMount(() => {
    console.log('Home page mounted');
  });
  
  const title = 'Welcome to Elysium.js';
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">{title}</h1>
  
  <p class="mb-4">
    This is your new Elysium.js project. Get started by editing this page!
  </p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-2">Documentation</h2>
      <p>Check out the documentation to learn more about Elysium.js.</p>
      <a href="https://github.com/yourusername/elysium-js" class="text-blue-500 hover:underline mt-2 inline-block">
        Learn more →
      </a>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-2">Examples</h2>
      <p>Explore examples to see what you can build with Elysium.js.</p>
      <a href="/examples" class="text-blue-500 hover:underline mt-2 inline-block">
        View examples →
      </a>
    </div>
  </div>
</div>
`;
  
  writeFileSync(join(projectPath, 'app/routes/+page.els'), homePageContent);
  
  // Create layout component
  const layoutContent = `<script>
  // You can add layout-specific logic here
</script>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Elysium.js App</title>
    ${useTailwind ? '<link href="/static/css/tailwind.css" rel="stylesheet" />' : ''}
    <script src="/static/js/htmx.min.js"></script>
  </head>
  <body class="bg-gray-100 min-h-screen">
    <nav class="bg-indigo-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <a href="/" class="text-xl font-bold">Elysium.js</a>
        <div class="space-x-4">
          <a href="/" class="hover:underline">Home</a>
          <a href="/about" class="hover:underline">About</a>
        </div>
      </div>
    </nav>
    
    <main>
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p>© ${new Date().getFullYear()} Elysium.js. All rights reserved.</p>
      </div>
    </footer>
  </body>
</html>
`;
  
  writeFileSync(join(projectPath, 'app/routes/+layout.els'), layoutContent);
  
  // Create about page
  const aboutPageContent = `<script>
  const title = 'About Elysium.js';
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">{title}</h1>
  
  <p class="mb-4">
    Elysium.js is a modern full-stack web framework built with the BETH stack:
  </p>
  
  <ul class="list-disc pl-6 mb-6">
    <li><strong>B</strong>un - Fast JavaScript runtime</li>
    <li><strong>E</strong>lysia - TypeScript web framework</li>
    <li><strong>T</strong>urso - SQLite database for the edge</li>
    <li><strong>H</strong>TMX - HTML extensions for dynamic content</li>
  </ul>
  
  <p>
    It combines the best features of SvelteKit, Next.js, and other modern frameworks
    to create a lightweight, ergonomic, and flexible development experience.
  </p>
</div>
`;
  
  writeFileSync(join(projectPath, 'app/routes/about/+page.els'), aboutPageContent);
  
  // Create API example
  const apiExampleContent = `import { Elysia } from 'elysia';

export default (app: Elysia) =>
  app.group('/api', (app) =>
    app
      .get('/hello', () => {
        return {
          message: 'Hello from Elysium.js API!',
          timestamp: new Date().toISOString()
        };
      })
      .post('/echo', ({ body }) => {
        return {
          echo: body,
          timestamp: new Date().toISOString()
        };
      })
  );
`;
  
  writeFileSync(join(projectPath, 'app/routes/api/+server.ts'), apiExampleContent);
  
  // Create HTMX example
  if (useTailwind) {
    // Create Tailwind config
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{els,ts,tsx,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    
    writeFileSync(join(projectPath, 'tailwind.config.js'), tailwindConfig);
    
    // Create PostCSS config
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    
    writeFileSync(join(projectPath, 'postcss.config.js'), postcssConfig);
    
    // Create CSS directory
    mkdirSync(join(projectPath, 'app/static/css'), { recursive: true });
    
    // Create Tailwind CSS file
    writeFileSync(
      join(projectPath, 'app/static/css/tailwind.css'),
      `@tailwind base;
@tailwind components;
@tailwind utilities;
`
    );
  }
  
  // Create JS directory and add HTMX
  mkdirSync(join(projectPath, 'app/static/js'), { recursive: true });
  
  // Download HTMX
  try {
    const htmxContent = await fetch('https://unpkg.com/htmx.org/dist/htmx.min.js').then(res => res.text());
    writeFileSync(join(projectPath, 'app/static/js/htmx.min.js'), htmxContent);
  } catch (error) {
    console.error('Failed to download HTMX. Please download it manually.');
  }
  
  // Create README.md
  const readmeContent = `# ${projectName}

A modern web application built with Elysium.js.

## Features

- Server-side rendering with Elysia JSX
- Interactive UI with HTMX
- Type-safe from frontend to backend
${orm === 'turso' ? '- Edge-ready database with Turso\n' : ''}
${useTailwind ? '- Modern CSS with Tailwind\n' : ''}
${useWebSockets ? '- WebSockets support\n' : ''}
${useGraphQL ? '- GraphQL API\n' : ''}
${useScheduler ? '- Scheduled tasks\n' : ''}
${useSwagger ? '- API documentation with Swagger\n' : ''}

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)

### Installation

\`\`\`bash
# Install dependencies
bun install
\`\`\`

### Development

\`\`\`bash
# Start development server
bun run dev
\`\`\`

### Production

\`\`\`bash
# Build for production
bun run build

# Start production server
bun run start
\`\`\`

## Project Structure

- \`app/\` - Application code
  - \`components/\` - Reusable UI components
  - \`routes/\` - Page and API routes
  - \`static/\` - Static assets
  - \`utils/\` - Utility functions
- \`src/\` - Server code
`;
  
  writeFileSync(join(projectPath, 'README.md'), readmeContent);
  
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  
  try {
    execSync('bun install', { cwd: projectPath, stdio: 'inherit' });
    
    // Build Tailwind CSS if selected
    if (useTailwind) {
      console.log('\n🎨 Building Tailwind CSS...');
      execSync(
        'bunx tailwindcss -i ./app/static/css/tailwind.css -o ./app/static/css/tailwind.css',
        { cwd: projectPath, stdio: 'inherit' }
      );
    }
    
    console.log('\n✅ Project created successfully!');
    console.log(`\nTo get started:
  cd ${projectName}
  bun run dev
    
Then open http://localhost:3000 in your browser.
`);
  } catch (error) {
    console.error('\n❌ Failed to install dependencies:', error);
    console.log('\nPlease run the following commands manually:');
    console.log(`  cd ${projectName}`);
    console.log('  bun install');
    if (useTailwind) {
      console.log('  bunx tailwindcss -i ./app/static/css/tailwind.css -o ./app/static/css/tailwind.css');
    }
    console.log('  bun run dev');
  }
  
  readline.close();
}

createElysiumProject().catch(error => {
  console.error('Error creating project:', error);
  process.exit(1);
});
