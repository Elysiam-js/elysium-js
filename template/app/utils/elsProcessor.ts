import { html } from '@elysiajs/html';

/**
 * Process .els component files and convert them to JSX
 * @param filePath Path to the .els file
 * @param content Content of the .els file
 * @returns Handler function for the route
 */
export function elsProcessor(filePath: string, content: string) {
  try {
    // Extract script section
    const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
    const script = scriptMatch ? scriptMatch[1].trim() : '';
    
    // Remove script section from content
    let template = content.replace(/<script>[\s\S]*?<\/script>/, '').trim();
    
    // Process control flow syntax
    template = processControlFlow(template);
    
    // Create component function
    const componentFn = createComponentFunction(script, template);
    
    // Return handler function
    return (context: any) => {
      try {
        // Execute component function with context
        const renderedHtml = componentFn(context);
        return html(renderedHtml);
      } catch (error) {
        console.error(`Error rendering component ${filePath}:`, error);
        return html(`<div class="error">Error rendering component: ${error.message}</div>`);
      }
    };
  } catch (error) {
    console.error(`Error processing .els file ${filePath}:`, error);
    return (context: any) => html(`<div class="error">Error processing component: ${error.message}</div>`);
  }
}

/**
 * Process control flow syntax in template
 * @param template Template string
 * @returns Processed template
 */
function processControlFlow(template: string): string {
  // Process if/else statements
  template = template
    .replace(/{#if\s+([^}]+)}/g, (_, condition) => `\${${condition} ? (`);
  
  template = template
    .replace(/{:else\s+if\s+([^}]+)}/g, (_, condition) => `) : ${condition} ? (`);
  
  template = template
    .replace(/{:else}/g, `) : (`);
  
  template = template
    .replace(/{\/if}/g, `) : ''}`);
  
  // Process each loops
  template = template
    .replace(/{#each\s+([^}\s]+)\s+as\s+([^}]+)(?:\s*,\s*([^}]+))?}/g, (_, items, item, index) => {
      if (index) {
        return `\${${items}.map((${item}, ${index}) => \``;
      }
      return `\${${items}.map((${item}, index) => \``;
    });
  
  template = template
    .replace(/{\/each}/g, `\`).join('')}`);
  
  // Process variables
  template = template.replace(/{([^#{}/][^{}]*)}/g, (_, expr) => `\${${expr}}`);
  
  return template;
}

/**
 * Create a component function from script and template
 * @param script Script content
 * @param template Template content
 * @returns Component function
 */
function createComponentFunction(script: string, template: string): Function {
  // Extract imports
  const imports: string[] = [];
  let match;
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+[^;]*|[^;{]*)\s+from\s+['"]([^'"]+)['"]/g;
  
  while ((match = importRegex.exec(script)) !== null) {
    imports.push(match[0]);
  }
  
  // Remove imports from script
  let processedScript = script.replace(importRegex, '');
  
  // Create function body
  const functionBody = `
    ${imports.join('\n')}
    
    return function(context) {
      // Component script
      ${processedScript}
      
      // Render template
      return \`${template}\`;
    };
  `;
  
  // Create and return function
  try {
    return new Function(functionBody)();
  } catch (error) {
    console.error('Error creating component function:', error);
    throw new Error(`Failed to create component function: ${error.message}`);
  }
}

export default elsProcessor;
