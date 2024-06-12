import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  theme: { defaultTheme: 'light' },
  components: {
    ...components,
    ...labs,
  },
  directives,
})

import { createPinia } from 'pinia'

const pinia = createPinia()

axios.defaults.baseURL = 'http://backend:8080'
axios.defaults.withCredentials= true

const app = createApp(App)
app.use(VueAxios, axios)
app.use(pinia)
app.use(vuetify)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

app.use(router)

app.mount('#app')

