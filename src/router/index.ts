import { createRouter, createWebHistory } from 'vue-router'

import Editor from '@/pages/Editor.vue'

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: Editor,
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
})

export default router
