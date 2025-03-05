export default {
  title: 'Elysium-js',
  description: 'A full-stack BETH (Bun, Elysia, Turso, HTMX) framework',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/yourusername/elysium-js' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Elysium-js?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Project Structure', link: '/guide/project-structure' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Routing', link: '/guide/routing' },
            { text: 'Layouts', link: '/guide/layouts' },
            { text: 'Database Integration', link: '/guide/database' },
            { text: 'HTMX Integration', link: '/guide/htmx' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Environment Variables', link: '/guide/environment-variables' },
            { text: 'Static Assets', link: '/guide/static-assets' },
            { text: 'Custom Components', link: '/guide/custom-components' },
            { text: 'Deployment', link: '/guide/deployment' },
            { text: 'Customization', link: '/guide/customization' }
          ]
        },
        {
          text: 'Best Practices',
          items: [
            { text: 'Code Organization', link: '/guide/code-organization' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Security', link: '/guide/security' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Server', link: '/api/server' },
            { text: 'Routing', link: '/api/routing' },
            { text: 'Database', link: '/api/database' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/elysium-js' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright  2025 Elysium-js'
    }
  },
  // Custom theme configuration
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['link', { rel: 'stylesheet', href: '/styles/custom.css' }]
  ]
}
