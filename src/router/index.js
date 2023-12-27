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
      path: '/register',
      name: 'registerView',
      component: () => import('../views/RegisterView.vue') 
    },
    {
      path: '/authPersonRegister',
      name: 'AuthPersonRegisterView',
      component: () => import('../views/AuthPersonRegisterView.vue') 
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
      component: () => import('../views/ScoresView.vue'),
      children: [
        { path: 'currentStatistics', component: () => import('../views/result/CurrentStatisticsView.vue') },
        { path: 'participantsByRegion', component: () => import('../views/result/ParticipantsByRegionView.vue') },
        { path: 'participantsByVoivodeship', component: () => import('../views/result/ParticipantsByVoivodeshipView.vue') },
        { path: 'resultsByRegion', component: () => import('../views/result/resultsByRegionView.vue') },
        { path: 'resultsByVoivodeship', component: () => import('../views/result/resultsByVoivodeshipView.vue') },
      ],
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
        { path: 'idee',component: () => import('../views/information/IdeeContestView.vue') },
        { path: 'awards',component: () => import('../views/information/AwardsView.vue') },
        { path: 'specification',component: () => import('../views/information/SpecificationContentTasksView.vue') },
        { path: 'conditions',component: () => import('../views/information/ConditionsOfParticipationView.vue') },
        { path: 'rules',component: () => import('../views/information/RulesView.vue') },
      ],
    },
    {
      path: '/allScores',
      name: 'allScoresView',
      component: () => import('../views/AllScoresView.vue')
    },
    {
      path: '/editProfile',
      name: 'editProfileView',
      component: () => import('../views/EditProfileView.vue')
    }
  ]
})

export default router