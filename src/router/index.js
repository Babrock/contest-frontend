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
      path: '/scores',
      name: 'scoresView',
      component: () => import('../views/ScoresView.vue')
    },
    {
      path: '/location',
      name: 'locationView',
      component: () => import('../views/LocationView.vue')
    },
    {
      path: '/informations',
      name: 'informationsView',
      component: () => import('../views/InformationsView.vue'),
      children: [
        { path: 'statute',component: () => import('../views/information/StatuteView.vue') },
        { path: 'genesis',component: () => import('../views/information/GenesisView.vue') },
      ],
    },
    {
      path: '/addScores',
      name: 'addScoresView',
      component: () => import('../views/addScoresView.vue')
    },
  ]
})

export default router