import restClient from '../client/rest-client'

export default {

  fecthChats() {
    return restClient.get('/chats')
  }
}
