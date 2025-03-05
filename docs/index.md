---
layout: home
customClass: "home-page"

hero:
  name: "Elysium-js"
  text: "A modern full-stack web framework"
  tagline: Built with the BETH stack - Bun, Elysia, Turso, HTMX
  image:
    src: /logo.svg
    alt: Elysium-js
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/elysium-js

features:
  - icon: 🚀
    title: Fast Development
    details: SvelteKit-inspired project structure for intuitive and rapid development
  - icon: 🔄
    title: Interactive UI
    details: HTMX integration for dynamic content without complex JavaScript
  - icon: 🛠️
    title: Type Safety
    details: Full TypeScript support throughout your application
  - icon: 🌐
    title: Edge Ready
    details: Turso database integration for global distribution
  - icon: 📦
    title: Easy Setup
    details: Simple CLI command with interactive options for project creation
  - icon: 🔌
    title: Flexible
    details: Support for multiple ORMs and customization options

---

<style>
.home-page .VPHero {
  position: relative;
  overflow: hidden;
}

.home-page .VPHero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.15), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15), transparent 40%);
  z-index: -1;
}

.home-page .VPFeatures {
  position: relative;
  z-index: 1;
}

.home-page .VPFeatures::before {
  content: '';
  position: absolute;
  top: -100px;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg));
  z-index: -1;
}

/* Animated background */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.home-page .VPHero .container {
  position: relative;
}

.home-page .VPHero .container::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: linear-gradient(45deg, 
    rgba(139, 92, 246, 0.03) 0%, 
    rgba(124, 58, 237, 0.03) 25%, 
    rgba(109, 40, 217, 0.03) 50%, 
    rgba(124, 58, 237, 0.03) 75%, 
    rgba(139, 92, 246, 0.03) 100%);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  z-index: -1;
  transform: rotate(30deg);
}

/* Floating animation for the logo */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.home-page .VPHero .image-container {
  animation: float 6s ease-in-out infinite;
}

/* Glowing effect for feature icons */
.home-page .VPFeatures .icon {
  position: relative;
}

.home-page .VPFeatures .icon::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 50%;
  z-index: -1;
  filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.home-page .VPFeature:hover .icon::after {
  opacity: 1;
}
</style>
