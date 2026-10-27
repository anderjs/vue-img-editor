<script setup lang="ts">
import { ref } from 'vue'
import { Bars, Moon, Sun, Times, Camera } from '@primeicons/vue'

import Button from 'primevue/button'
import Adjustments from '@/components/AppAdjusments.vue'

defineOptions({ name: 'AppLayout' })

const isDarkMode = ref(true)

const isSidebarOpen = ref(false)

const applyTheme = () => {
  const root = document.documentElement
  root.classList.toggle('app-dark', isDarkMode.value)
  root.classList.toggle('app-light', !isDarkMode.value)
  root.style.colorScheme = isDarkMode.value ? 'dark' : 'light'
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value

  applyTheme()
}

applyTheme()
</script>

<template>
  <div class="application-shell">
    <header class="topbar">
      <Button
        class="sidebar-toggle"
        text
        :aria-label="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
        :aria-expanded="isSidebarOpen"
        aria-controls="application-sidebar"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <Times v-if="isSidebarOpen" aria-hidden="true" />
        <Bars v-else aria-hidden="true" />
      </Button>

      <div class="brand" aria-label="Luma">
        <span aria-hidden="true">
          <Camera class="brand-icon" />
        </span>
        <span>Luma</span>
      </div>

      <div id="photo-actions" class="photo-actions-host" />

      <Button
        class="theme-toggle"
        text
        :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-pressed="isDarkMode"
        @click="toggleTheme"
      >
        <Moon v-if="isDarkMode" aria-hidden="true" />
        <Sun v-else aria-hidden="true" />
      </Button>
    </header>

    <div class="shell-body" :class="{ 'sidebar-open': isSidebarOpen }">
      <main class="main-content">
        <slot />
      </main>

      <aside id="application-sidebar" class="sidebar" aria-label="Sidebar">
        <nav class="sidebar-navigation" aria-label="Main navigation">
          <Adjustments />
        </nav>
      </aside>
    </div>

    <footer class="footer" aria-label="Application footer" />
  </div>
</template>

<style scoped>
.application-shell {
  --shell-control-hover: color-mix(in srgb, var(--text-primary) 5%, transparent);

  display: grid;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  grid-template-rows: 56px minmax(0, 1fr) 22px;
  overflow: hidden;
  background: var(--background);
  color: var(--text-primary);
}

.topbar {
  display: flex;
  position: relative;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  background: var(--surface);
}

.sidebar-toggle {
  display: none;
  width: 34px;
  height: 34px;
  color: var(--text-secondary);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex: 0 0 auto;
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.03em;
}

.brand-mark {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--primary) 30%, var(--border));
  border-radius: 9px;
  background: color-mix(in srgb, var(--primary) 10%, var(--surface));
}

.brand-icon {
  width: 17px;
  height: 17px;
  color: var(--primary);
}

.photo-actions-host {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.theme-toggle {
  min-height: 34px;
  gap: 8px;
  padding: 0 10px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.theme-toggle:hover {
  color: var(--primary);
  background: var(--shell-control-hover);
}

.shell-body {
  display: flex;
  min-height: 0;
}

.sidebar-toggle:hover {
  color: var(--primary);
  background: var(--shell-control-hover);
}

.sidebar {
  display: flex;
  width: 312px;
  flex: 0 0 312px;
  flex-direction: column;
  min-height: 0;
  padding: 18px;
  background: var(--surface);
  overflow-y: auto;
}

.sidebar-navigation {
  width: 100%;
}

.main-content {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background: var(--workspace);
}

.main-content::before,
.main-content::after {
  position: absolute;
  z-index: 1;
  inset: 12px;
  pointer-events: none;
  content: '';
}

.main-content::before {
  background:
    linear-gradient(var(--border), var(--border)) top left / 16px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) top left / 1px 16px no-repeat,
    linear-gradient(var(--border), var(--border)) top right / 16px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) top right / 1px 16px no-repeat;
}

.main-content::after {
  background:
    linear-gradient(var(--border), var(--border)) bottom left / 16px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom left / 1px 16px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom right / 16px 1px no-repeat,
    linear-gradient(var(--border), var(--border)) bottom right / 1px 16px no-repeat;
}

.footer {
  background: var(--surface);
}

.application-shell :deep(.p-button:focus-visible) {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .topbar {
    gap: 10px;
    padding: 0 14px;
  }

  .sidebar-toggle {
    display: inline-flex;
    flex: 0 0 auto;
  }

  .brand {
    flex-basis: auto;
  }

  .shell-body {
    position: relative;
  }

  .sidebar {
    display: none;
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    right: 0;
    width: 236px;
    flex-basis: 236px;
    padding: 20px 14px;
  }

  .sidebar-open .sidebar {
    display: flex;
  }
}

@media (max-width: 420px) {
  .topbar {
    padding: 0 10px;
  }

  .theme-toggle {
    width: 36px;
    justify-content: center;
    padding: 0;
  }

  .theme-toggle :deep(.p-button-label) {
    display: none;
  }
}
</style>
