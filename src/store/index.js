import Vue from 'vue'
import Vuex from 'vuex'
import user from './moudle/user'

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
    user
  }
})
