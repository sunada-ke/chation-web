import roomsApi from '../../api/rooms-api'
import { FETCH_ROOMS } from '../action-types'
import { SET_ROOMS, SET_FETCH_ROOMS_ERROR } from '../mutation-types'

const state = {
  rooms: [],
  fetchRoomsError: null
}

const actions = {
  [FETCH_ROOMS]({ commit }) {
    roomsApi
      .fecthRooms()
      .then(res => {
        commit(SET_ROOMS, res.data)
      })
      .catch(e => {
        commit(SET_FETCH_ROOMS_ERROR, e)
      })
  }
}

const mutations = {

  [SET_ROOMS] (state, rooms) {
    state.rooms = rooms
  },

  [SET_FETCH_ROOMS_ERROR] (state, e) {
    state.fetchRoomsError = e
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
