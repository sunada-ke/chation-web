import auth from './auth'
import htmlTitle from './html-title'

export default function registerMiddleware(router) {
  auth(router)
  htmlTitle(router)
}
