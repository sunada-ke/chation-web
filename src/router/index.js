import Vue from 'vue'
import Router from 'vue-router'
import signin from '../vuex/modules/signin'
import SignIn from '@/components/SignIn'
import AuthCallback from '@/components/AuthCallback'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'signin',
      path: '/signin',
      component: SignIn,
      meta: { title: 'Chation Sign in' }
    },
    {
      name: 'callback',
      path: '/auth/callback',
      component: AuthCallback
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      meta: {
        authRequired: true,
        title: 'Chation Home'
      }
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired) && !signin.state.authenticated) {
    next({path: '/signin'})
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
