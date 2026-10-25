import { createApp } from 'vue'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import stores from './stores'
import router from './router'
import { ui } from './config/prime.ui'
import './style.css'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(PrimeVue, ui)

app.mount('#app')
