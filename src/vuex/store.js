import Vue from 'vue'
import Vuex from 'vuex'
// import home from './modules/home'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // home
  },
  // In strict mode, if the state of Vuex is changed outside the mutation handler, it will throw an error.
  // Disable it in the production environment to avoid performance cost.
  strict: process.env.NODE_ENV !== 'production'
})
