import auth0 from 'auth0-js'

const authClient = new auth0.WebAuth({
  domain: process.env.DOMAIN,
  clientID: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URL,
  audience: process.env.AUDIENCE,
  responseType: process.env.RESPONSE_TYPE,
  scope: process.env.SCOPE
})

export default {

  authorize() {
    authClient.authorize()
  },

  parseHash(options, cb) {
    // TODO: not api's function
    authClient.parseHash(options, cb)
  }
}
