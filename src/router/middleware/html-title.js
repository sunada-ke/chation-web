export default function title(router) {
  router.afterEach((to, from) => {
    if (to.meta && to.meta.title) {
      document.title = to.meta.title
    }
  })
}
