import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
  
    {
      path: '/sprite-creator',
      name: 'sprite-creator',
      component: () => import('../views/SpriteCreator.vue')
    }
  ]
})

export default router
