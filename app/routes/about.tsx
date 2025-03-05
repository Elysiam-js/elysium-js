export const AboutPage = () => {
  return (
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-4">About Elysium JS</h2>
      
      <p class="text-lg text-gray-700 mb-4">
        Elysium JS is a modern web application built using the BETH stack, 
        combining the best tools in the JavaScript ecosystem to create 
        fast, type-safe, and interactive web applications.
      </p>
      
      <h3 class="text-2xl font-semibold mb-2">The BETH Stack</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 class="text-xl font-bold text-blue-600">Bun</h4>
          <p class="text-gray-700">
            A fast all-in-one JavaScript runtime with built-in bundler, 
            test runner, and package manager.
          </p>
        </div>
        
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 class="text-xl font-bold text-blue-600">Elysia</h4>
          <p class="text-gray-700">
            A TypeScript framework for Bun focused on developer experience 
            and performance.
          </p>
        </div>
        
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 class="text-xl font-bold text-blue-600">Turso</h4>
          <p class="text-gray-700">
            A SQLite database for the edge, built on libSQL, providing 
            distributed and scalable data storage.
          </p>
        </div>
        
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 class="text-xl font-bold text-blue-600">HTMX</h4>
          <p class="text-gray-700">
            A library that allows you to access modern browser features 
            directly from HTML, rather than using JavaScript.
          </p>
        </div>
      </div>
      
      <h3 class="text-2xl font-semibold mb-2">Features</h3>
      <ul class="list-disc ml-6 text-gray-700 space-y-1">
        <li>Fast server-side rendering</li>
        <li>Type-safe from frontend to backend</li>
        <li>Interactive UI without complex JavaScript frameworks</li>
        <li>Edge-ready database with Turso</li>
        <li>Modern CSS with Tailwind</li>
        <li>SvelteKit-inspired project structure</li>
      </ul>
    </div>
  );
};
