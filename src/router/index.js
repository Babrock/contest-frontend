import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../store/auth.js'

const checkAuthentication = (to, from, next) => {
  const isAuthenticated = useAuthStore().isAuthenticated; 
  if (isAuthenticated) {
    next();
  } else {
    next('/login');
  }
}

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
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'loginView',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/scores',
      name: 'scoresView',
      component: () => import('@/views/ScoresView.vue'),
      children: [
        { path: 'currentStatistics', component: () => import('@/views/result/CurrentStatisticsView.vue') },
        { path: 'participantsByRegion', component: () => import('@/views/result/ParticipantsByRegionView.vue') },
        { path: 'participantsByVoivodeship', component: () => import('@/views/result/ParticipantsByVoivodeshipView.vue') },
        { path: 'resultsByRegion', component: () => import('@/views/result/ResultsByRegionView.vue') },
        { path: 'resultsByVoivodeship', component: () => import('@/views/result/ResultsByVoivodeshipView.vue') },
      ],
    },
    {
      path: '/location',
      name: 'locationView',
      component: () => import('@/views/LocationView.vue')
    },
    {
      path: '/informations',
      name: 'informationsView',
      component: () => import('@/views/InformationsView.vue'),
      children: [
        { path: 'statute',component: () => import('@/views/information/StatuteView.vue') },
        { path: 'genesis',component: () => import('@/views/information/GenesisView.vue') },
        { path: 'idee',component: () => import('@/views/information/IdeeContestView.vue') },
        { path: 'awards',component: () => import('@/views/information/AwardsView.vue') },
        { path: 'specification',component: () => import('@/views/information/SpecificationContentTasksView.vue') },
        { path: 'conditions',component: () => import('@/views/information/ConditionsOfParticipationView.vue') },
        { path: 'rules',component: () => import('@/views/information/RulesView.vue') },
      
      ],
    },
    {
      path: '/form',
      name: 'formView',
      component: () => import('@/views/FormView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/auth-person-register',
      name: 'AuthPersonRegisterView',
      component: () => import('@/views/AuthPersonRegisterView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/edit-score',
      name: 'editScoreView',
      component: () => import('@/views/EditScoreView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/accept-form',
      name: 'acceptFormView',
      component: () => import('../views/AcceptFormView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/export-csv',
      name: 'exportCsvView',
      component: () => import('@/views/ExportCsvView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/import-csv',
      name: 'importCsvView',
      component: () => import('@/views/ImportCsvView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/regions',
      name: 'regionsView',
      component: () => import('@/views/RegionsView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/edit-profile',
      name: 'editProfile',
      component: () => import('../views/EditProfileView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/send-email',
      name: 'sendEmail',
      component: () => import('../views/SendEmailView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/edit-form',
      name: 'editForm',
      component: () => import('../views/EditFormView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/acceptedSchools',
      name: 'acceptedSchools',
      component: () => import('../views/AcceptedSchoolsView.vue'),
    },
    {
      path: '/add-edition',
      name: 'addEdition',
      component: () => import('../views/AddEditionView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/edit-home-page',
      name: 'EditHomePage',
      component: () => import('../views/EditHomePageView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/edit-home-page-image',
      name: 'EditHomePageImage',
      component: () => import('../views/EditHomePageImageView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/print-table',
      name: 'PrintTable',
      component: () => import('../views/PrintTableView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/display-pdf',
      name: 'DisplayPdf',
      component: () => import('../views/DisplayPdfView.vue'),
      beforeEnter: checkAuthentication,
    },
    {
      path: '/add-Sign-pdf',
      name: 'AddSignPdf',
      component: () => import('../views/AddSignPdf.vue'),
      beforeEnter: checkAuthentication,
    },
  ]
})

export default router