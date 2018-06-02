const ACCESS_TOKEN = 'access_token'
const ID_TOKEN = 'id_token'
const EXPIRES_AT = 'expires_at'

export default {

  saveTokens(accessToken, idToken, expiresAt) {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
    localStorage.setItem(ID_TOKEN, idToken)
    localStorage.setItem(EXPIRES_AT, expiresAt)
  },

  deleteTokens() {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(ID_TOKEN)
    localStorage.removeItem(EXPIRES_AT)
  },

  findIdToken() {
    return localStorage.getItem(ID_TOKEN)
  },

  findExpiresAt() {
    return JSON.parse(localStorage.getItem(EXPIRES_AT))
  }
}
