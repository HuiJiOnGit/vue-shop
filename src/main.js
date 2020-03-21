import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Vuex from 'vuex'

import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import './assets/css/global.css'
// 导入icon
import './assets/fonts/iconfont.css'
//引入黑暗模式
import './assets/css/dark.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1'

// axios 请求拦截
axios.interceptors.request.use(config => {
  //为请求头添加authorization
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
