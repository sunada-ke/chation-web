import auth from '../../api/auth'
import storage from '../../storage/storage'
import { SIGN_IN, SAVE_TOKENS } from '../action-types'
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
        let expiresAt = JSON.stringify(
          result.expiresIn * 1000 + new Date().getTime()
        )

        storage.save('access_token', result.accessToken)
        storage.save('id_token', result.idToken)
        storage.save('expires_at', expiresAt)

        commit(SET_AUTHENTICATED, true)
      } else if (e) {
        console.log(e)
        // TODO: Error Hanling (Promise or Notification)
      }
    })
  }
}

const mutations = {
  [SET_AUTHENTICATED] (state, authenticated) {
    state.authenticated = authenticated
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
