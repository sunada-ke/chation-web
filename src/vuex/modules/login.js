import authApi from '../../api/auth-api'
import webAuth from '../../auth/web-auth'
import tokenCache from '../../cache/token-cache'
import { LOGIN, SAVE_TOKENS } from '../action-types'
import { SET_AUTHENTICATED, SET_PARSE_HASH_ERROR } from '../mutation-types'

const state = {
  authenticated: false
}

const actions = {
  [LOGIN]({ commit }) {
    authApi.authorize()
  },

  [SAVE_TOKENS] ({ commit }) {
    webAuth.parseHash((e, result) => {
      if (result && result.accessToken && result.idToken) {
        let expiresAt = JSON.stringify(result.expiresIn * 1000 + new Date().getTime())
        tokenCache.saveTokens(result.accessToken, result.idToken, expiresAt)
        commit(SET_AUTHENTICATED)
      } else if (e) {
        commit(SET_PARSE_HASH_ERROR, e)
      }
    })
  }
}

const mutations = {

  [SET_AUTHENTICATED] (state) {
    state.authenticated = true
  },

  [SET_PARSE_HASH_ERROR] (state, e) {
    state.parseHashError = e
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
