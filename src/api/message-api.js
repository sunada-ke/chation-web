import restClient from '../client/rest-client'

export default {

  fecthMessages(chatId) {
    return restClient.get('/messages?chatId=' + chatId)
  }
}
