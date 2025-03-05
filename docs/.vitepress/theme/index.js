import DefaultTheme from 'vitepress/theme'
import './custom.css'
import GlassyCard from './GlassyCard.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register custom components
    app.component('GlassyCard', GlassyCard)
  }
}
