import axios from 'axios'

const REST_SERVER_URI = process.env.REST_SERVER_URI

export default {

  get(path) {
    return axios.get(REST_SERVER_URI + path)
  }
}
