import { formToJSON } from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homeView',
      component: HomeView
    },
    {
      path: '/login',
      name: 'loginView',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/form',
      name: 'formView',
      component: () => import('../views/FormView.vue')
    },
    {
      path: '/results',
      name: 'resultsView',
      component: () => import('../views/ResultsView.vue')
    },
    {
      path: '/location',
      name: 'locationView',
      component: () => import('../views/LocationView.vue')
    },
    {
      path: '/informations',
      name: 'informationsView',
      component: () => import('../views/InformationsView.vue')
    },
  ]
})

export default router