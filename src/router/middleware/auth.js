import tokenCache from '../../cache/token-cache'

export default function auth(router) {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
      let idToken = tokenCache.findIdToken()
      let expiresAt = tokenCache.findExpiresAt()
      let expired = !(new Date().getTime() < expiresAt)

      idToken && !expired ? next() : next({ path: '/signin' })
    } else {
      next()
    }
  })
}
