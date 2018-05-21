import Router from 'vue-router'
import middleware from './middleware'
import SignIn from '@/components/SignIn'
import AuthCallback from '@/components/AuthCallback'
import Home from '@/components/Home'

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

middleware(router)

export default router
