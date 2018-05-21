import auth from './auth'
import htmlTitle from './html-title'

export default function middleware(router) {
  auth(router)
  htmlTitle(router)
}
