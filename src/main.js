import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Vuex from 'vuex'
import * as Api from './api/index'


import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import './assets/css/global.css'
// 导入icon
import './assets/fonts/iconfont.css'
//引入黑暗模式
import './assets/css/dark.css'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.prototype.$api = Api

Vue.config.productionTip = false

// 注册个全局拦截器
Vue.filter('dateFormat',function(oldValue) {
  let dt = new Date(oldValue);

  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + '').padStart(2,'0');
  let d = (dt.getDate() + '').padStart(2, '0');

  let hh = (dt.getHours() + '').padStart(2, '0');
  let mm = (dt.getMinutes() + '').padStart(2, '0');
  let ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


Vue.use(ElementUI)
Vue.use(Vuex)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
