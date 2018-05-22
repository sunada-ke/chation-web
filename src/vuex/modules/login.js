import auth from '../../api/auth'
import tokenCache from '../../cache/token-cache'
import { LOGIN, SAVE_TOKENS } from '../action-types'
import { SET_AUTHENTICATED } from '../mutation-types'
import auth0 from 'auth0-js'

// TODO:
var webAuth = new auth0.WebAuth({
  domain: process.env.DOMAIN,
  clientID: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URL,
  audience: process.env.AUDIENCE,
  responseType: process.env.RESPONSE_TYPE,
  scope: process.env.SCOPE
})

const state = {
  authenticated: false
}

const actions = {
  [LOGIN] ({ commit }) {
    auth.authorize()
  },
  [SAVE_TOKENS] ({ commit }) {
    webAuth.parseHash((e, result) => {
      if (result && result.accessToken && result.idToken) {
        let expiresAt = JSON.stringify(result.expiresIn * 1000 + new Date().getTime())
        tokenCache.saveTokens(result.accessToken, result.idToken, expiresAt)
        commit(SET_AUTHENTICATED)
      } else if (e) {
        console.log(e)
        // TODO: Error Hanling (Promise or Notification)
      }
    })
  }
}

const mutations = {
  [SET_AUTHENTICATED] (state) {
    state.authenticated = true
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
