import restClient from '../client/rest-client'

export default {

  fecthRooms() {
    return restClient.get('/rooms')
  }
}
