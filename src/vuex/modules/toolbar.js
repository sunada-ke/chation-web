import tokenCache from '../../cache/token-cache'
import { LOGOUT } from '../action-types'
import { SET_LOGGED_OUT } from '../mutation-types'

const state = {
  loggedOut: false
}

const actions = {

  [LOGOUT]({ commit }) {
    tokenCache.deleteTokens()
    commit(SET_LOGGED_OUT)
  }
}

const mutations = {

  [SET_LOGGED_OUT] (state) {
    state.loggedOut = true
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
