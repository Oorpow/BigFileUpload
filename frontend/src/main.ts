import { createApp } from 'vue'
import { createPinia } from 'pinia'
import mavonEditor from 'mavon-editor'
import mitt from 'mitt'
import router from './router'
import App from './App.vue'
import '@/assets/css/global.css'
import '@/assets/css/theme.less'
import 'uno.css'
import 'mavon-editor/dist/css/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
const Mitt = mitt()

declare module 'vue' {
  export interface ComponentCustomProperties {
    $Bus: typeof Mitt
  }
}

app.config.globalProperties.$Bus = Mitt

app.use(createPinia()).use(router).use(mavonEditor)

app.mount('#app')
