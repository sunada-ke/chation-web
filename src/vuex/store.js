import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    login
  },

  // In strict mode, if the state of Vuex is changed outside the mutation handler, it will throw an error.
  // Disable it in the production environment to avoid performance cost.
  strict: process.env.NODE_ENV !== 'production'
})
