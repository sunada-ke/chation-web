import auth0 from 'auth0-js'

var webAuth = new auth0.WebAuth({
  domain: process.env.DOMAIN,
  clientID: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URL,
  audience: process.env.AUDIENCE,
  responseType: process.env.RESPONSE_TYPE,
  scope: process.env.SCOPE
})

export default {
  authorize() {
    webAuth.authorize()
  },
  parseHash(options, cb) {
    // TODO: not api's function
    webAuth.parseHash(options, cb)
  }
}
