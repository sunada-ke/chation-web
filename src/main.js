// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'
import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import router from './router'
import store from './vuex/store'
import VueI18n from 'vue-i18n'
import Router from 'vue-router'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(VueI18n)
Vue.use(Vuetify, {
  theme: {
    primary: colors.lightBlue.base,
    secondary: colors.grey.darken1,
    accent: colors.deepOrange.base,
    error: colors.red.accent3
  }
})

const i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages: {
    en: require('./localizable/en.json'),
    ja: require('./localizable/ja.json')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n: i18n,
  router,
  components: { App },
  template: '<App/>',
  store
})
