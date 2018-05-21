import auth from '../../api/auth'
import tokenCache from '../../storage/token-cache'
import { SIGN_IN, SAVE_TOKENS, CHECK_AUTHENTICATED } from '../action-types'
import { SET_AUTHENTICATED } from '../mutation-types'

const state = {
  authenticated: false
}

const actions = {
  [SIGN_IN] ({ commit }) {
    auth.authorize()
  },
  [SAVE_TOKENS] ({ commit }) {
    auth.parseHash((e, result) => {
      if (result && result.accessToken && result.idToken) {
        let expiresAt = JSON.stringify(result.expiresIn * 1000 + new Date().getTime())
        tokenCache.saveTokens(result.accessToken, result.idToken, expiresAt)

        commit(SET_AUTHENTICATED)
      } else if (e) {
        console.log(e)
        // TODO: Error Hanling (Promise or Notification)
      }
    })
  },
  [CHECK_AUTHENTICATED]({ commit }) {
    let idToken = localStorage.getItem('id_token')
    if (idToken) {
      commit(SET_AUTHENTICATED)
    }
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
