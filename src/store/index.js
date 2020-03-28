import Vue from 'vue'
import Vuex from 'vuex'
import user from './moudle/user'
import role from './moudle/role'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dark:false
  },
  mutations: {
    onVan(state,bool){
      state.dark=bool
    }
  },
  actions: {
  },
  modules: {
    user,
    role
  }
})
