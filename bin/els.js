#!/usr/bin/env node

/**
 * Elysium.js CLI Tool
 * A command-line interface for generating routes, pages, and API endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

// Templates directory
const templatesDir = path.join(__dirname, '..', 'templates');

// Create templates directory if it doesn't exist
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// CLI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Command templates
const templates = {
  page: `<script>
  // Page component script
  import { onMount } from 'elysium';
  
  // State variables
  let title = '{{name}} Page';
  
  // Lifecycle hooks
  onMount(() => {
    console.log('{{name}} page mounted');
  });
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">{title}</h1>
  
  <div class="bg-white shadow rounded-lg p-6">
    <p class="text-gray-600">
      This is the {{name}} page. Edit this template in <code>{{path}}</code>
    </p>
  </div>
</div>`,

  api: `import { Elysia } from 'elysia';

/**
 * {{name}} API routes
 * @param app Elysia application instance
 */
export default function(app: Elysia) {
  // GET endpoint
  app.get('/', ({ success }) => {
    return success({
      message: '{{name}} API endpoint',
      timestamp: new Date().toISOString()
    }, '{{name}} endpoint called successfully');
  });
  
  // POST endpoint
  app.post('/', ({ body, created, error }) => {
    if (!body) {
      throw error.BadRequest('Request body is required');
    }
    
    return created({
      received: body,
      timestamp: new Date().toISOString()
    }, '{{name}} data created successfully');
  });
  
  // PUT endpoint
  app.put('/:id', ({ params, body, success, error }) => {
    const id = params.id;
    
    if (!body) {
      throw error.BadRequest('Request body is required');
    }
    
    return success({
      id,
      updated: body,
      timestamp: new Date().toISOString()
    }, '{{name}} data updated successfully');
  });
  
  // DELETE endpoint
  app.delete('/:id', ({ params, noContent }) => {
    // Delete logic here
    return noContent();
  });
  
  return app;
}`,

  model: `/**
 * {{name}} model
 */
export interface {{pascalName}} {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * {{name}} creation data transfer object
 */
export interface Create{{pascalName}}Dto {
  name: string;
}

/**
 * {{name}} update data transfer object
 */
export interface Update{{pascalName}}Dto {
  name?: string;
}

/**
 * In-memory {{name}} store
 */
class {{pascalName}}Store {
  private items: {{pascalName}}[] = [];
  private nextId = 1;
  
  /**
   * Get all items
   */
  getAll(): {{pascalName}}[] {
    return [...this.items];
  }
  
  /**
   * Get item by ID
   */
  getById(id: number): {{pascalName}} | undefined {
    return this.items.find(item => item.id === id);
  }
  
  /**
   * Create a new item
   */
  create(data: Create{{pascalName}}Dto): {{pascalName}} {
    const now = new Date();
    const item: {{pascalName}} = {
      id: this.nextId++,
      name: data.name,
      createdAt: now,
      updatedAt: now
    };
    
    this.items.push(item);
    return item;
  }
  
  /**
   * Update an item
   */
  update(id: number, data: Update{{pascalName}}Dto): {{pascalName}} | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    const item = this.items[index];
    const updatedItem: {{pascalName}} = {
      ...item,
      ...data,
      updatedAt: new Date()
    };
    
    this.items[index] = updatedItem;
    return updatedItem;
  }
  
  /**
   * Delete an item
   */
  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.items.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const {{camelName}}Store = new {{pascalName}}Store();`
};

// Save templates to files
Object.entries(templates).forEach(([name, content]) => {
  const templatePath = path.join(templatesDir, `${name}.template`);
  if (!fs.existsSync(templatePath)) {
    fs.writeFileSync(templatePath, content);
  }
});

// Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => capitalize(word))
    .join('');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function replaceTemplateVars(template, vars) {
  let result = template;
  Object.entries(vars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for input
function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Generate a file from a template
function generateFile(templateName, filePath, vars) {
  // Ensure template exists
  const templatePath = path.join(templatesDir, `${templateName}.template`);
  if (!fs.existsSync(templatePath)) {
    console.error(`${colors.fg.red}Template ${templateName} not found${colors.reset}`);
    return false;
  }
  
  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`${colors.fg.yellow}File ${filePath} already exists${colors.reset}`);
    return false;
  }
  
  // Read template and replace variables
  const template = fs.readFileSync(templatePath, 'utf-8');
  const content = replaceTemplateVars(template, vars);
  
  // Write file
  fs.writeFileSync(filePath, content);
  console.log(`${colors.fg.green}Created ${filePath}${colors.reset}`);
  return true;
}

// Generate a page
async function generatePage(routePath) {
  const name = path.basename(routePath);
  const dirPath = path.join(cwd, 'app', 'routes', routePath);
  const filePath = path.join(dirPath, '+page.els');
  
  return generateFile('page', filePath, {
    name: toPascalCase(name),
    path: filePath.replace(cwd, '')
  });
}

// Generate an API endpoint
async function generateApi(routePath) {
  const name = path.basename(routePath);
  const dirPath = path.join(cwd, 'app', 'routes', 'api', routePath);
  const filePath = path.join(dirPath, '+server.ts');
  
  return generateFile('api', filePath, {
    name: toCamelCase(name)
  });
}

// Generate a model
async function generateModel(modelName) {
  const filePath = path.join(cwd, 'app', 'models', `${modelName}.ts`);
  
  return generateFile('model', filePath, {
    name: modelName,
    pascalName: toPascalCase(modelName),
    camelName: toCamelCase(modelName)
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    showHelp();
    rl.close();
    return;
  }
  
  switch (command) {
    case 'generate':
    case 'g':
      await handleGenerate(args.slice(1));
      break;
    
    case 'help':
      showHelp();
      break;
    
    default:
      console.error(`${colors.fg.red}Unknown command: ${command}${colors.reset}`);
      showHelp();
      break;
  }
  
  rl.close();
}

// Handle generate command
async function handleGenerate(args) {
  const type = args[0];
  const name = args[1];
  
  if (!type || !name) {
    console.error(`${colors.fg.red}Missing type or name${colors.reset}`);
    console.log(`Usage: els generate <type> <name>`);
    return;
  }
  
  switch (type) {
    case 'page':
    case 'p':
      await generatePage(name);
      break;
    
    case 'api':
    case 'a':
      await generateApi(name);
      break;
    
    case 'model':
    case 'm':
      await generateModel(name);
      break;
    
    case 'resource':
    case 'r':
      // Generate a complete resource (model, API, and page)
      const modelSuccess = await generateModel(name);
      const apiSuccess = await generateApi(name);
      const pageSuccess = await generatePage(name);
      
      if (modelSuccess && apiSuccess && pageSuccess) {
        console.log(`${colors.fg.green}Successfully generated ${name} resource${colors.reset}`);
      }
      break;
    
    default:
      console.error(`${colors.fg.red}Unknown type: ${type}${colors.reset}`);
      console.log(`Valid types: page, api, model, resource`);
      break;
  }
}

// Show help
function showHelp() {
  console.log(`
${colors.bright}${colors.fg.cyan}Elysium.js CLI Tool${colors.reset}

${colors.fg.yellow}Usage:${colors.reset}
  els generate <type> <name>
  els g <type> <name>

${colors.fg.yellow}Types:${colors.reset}
  page, p       Generate a page component
  api, a        Generate an API endpoint
  model, m      Generate a data model
  resource, r   Generate a complete resource (model, API, and page)

${colors.fg.yellow}Examples:${colors.reset}
  els generate page about
  els g api users
  els g model product
  els g resource blog
  `);
}

// Run the CLI
main().catch(err => {
  console.error(`${colors.fg.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
