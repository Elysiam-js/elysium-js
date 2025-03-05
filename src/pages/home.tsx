export const HomePage = () => {
  return (
    <div class="space-y-6">
      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold mb-4">Welcome to Elysium JS</h2>
        <p class="text-lg text-gray-700">
          A modern full-stack application built with the BETH stack:
        </p>
        <ul class="list-disc ml-6 mt-2 text-gray-700">
          <li><strong>B</strong>un - A fast JavaScript runtime</li>
          <li><strong>E</strong>lysia - A TypeScript web framework</li>
          <li><strong>T</strong>ypeScript - Type-safe JavaScript</li>
          <li><strong>H</strong>TMX - HTML extensions for dynamic content</li>
        </ul>
      </section>

      <section class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Todo Application</h2>
        <div class="mb-4">
          <form 
            class="flex gap-2" 
            hx-post="/api/todos" 
            hx-target="#todo-list" 
            hx-swap="beforeend"
            hx-on::after-request="this.reset()"
          >
            <input 
              type="text" 
              name="content" 
              placeholder="Add a new todo..." 
              class="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required
            />
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </form>
        </div>
        
        <div id="todo-list" class="space-y-2">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <p class="text-gray-800">Loading todos...</p>
          </div>
        </div>
      </section>
    </div>
  );
};
