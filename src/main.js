import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import * as Vue from 'vue' // in Vue 3
import axios from 'axios'
import VueAxios from 'vue-axios'

import { createPinia } from 'pinia'
const pinia = createPinia()

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials= true

import { TablePlugin } from 'bootstrap-vue'
const app = createApp(App)
app.use(VueAxios, axios)
app.use(pinia)
app.use(TablePlugin)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'


app.use(router)

app.mount('#app')

