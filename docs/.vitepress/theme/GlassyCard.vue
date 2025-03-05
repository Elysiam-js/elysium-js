<template>
  <div class="glassy-card" :class="{ 'with-icon': icon }">
    <div v-if="icon" class="icon">{{ icon }}</div>
    <div class="content">
      <h3 v-if="title" class="title">{{ title }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.glassy-card {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.glassy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  z-index: -1;
}

.glassy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(139, 92, 246, 0.25);
}

.glassy-card.with-icon {
  display: flex;
  align-items: flex-start;
}

.glassy-card .icon {
  font-size: 2rem;
  margin-right: 16px;
  background: linear-gradient(135deg, #c4b5fd, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.glassy-card .content {
  flex: 1;
}

.glassy-card .title {
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--vp-c-brand-lighter);
}

.glassy-card .description {
  margin: 0;
  opacity: 0.8;
}
</style>
