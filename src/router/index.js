import Router from 'vue-router'
import middleware from './middleware'
import Login from '@/components/Login'
import AuthCallback from '@/components/AuthCallback'
import Home from '@/components/Home'

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/action/login',
      component: Login,
      meta: { title: 'Chation Login' }
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
