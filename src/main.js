import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router/router'
import store from './store/store'

import './assets/stylus/index.styl'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
