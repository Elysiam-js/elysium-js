import { PropsWithChildren } from 'hono/jsx';

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Elysium JS - BETH Stack</title>
        <link rel="stylesheet" href="/static/styles/main.css" />
        <script src="https://unpkg.com/htmx.org@1.9.6" integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 min-h-screen">
        <header class="bg-blue-600 text-white p-4 shadow-md">
          <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">Elysium JS</h1>
            <nav>
              <ul class="flex space-x-4">
                <li><a href="/" class="hover:underline">Home</a></li>
                <li><a href="/about" class="hover:underline">About</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main class="container mx-auto p-4">
          {children}
        </main>
        
        <footer class="bg-gray-800 text-white p-4 mt-8">
          <div class="container mx-auto text-center">
            <p>© {new Date().getFullYear()} Elysium JS - Built with the BETH Stack</p>
          </div>
        </footer>
      </body>
    </html>
  );
};
