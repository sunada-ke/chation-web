import chatApi from '../../api/chat-api'
import messageApi from '../../api/message-api'
import { FETCH_CHATS, FETCH_MESSAGES } from '../action-types'
import { SET_CHATS, SET_MESSAGES, SET_FETCH_CHATS_ERROR, SET_FETCH_MESSAGES_ERROR } from '../mutation-types'

const state = {
  chats: [],
  messages: [],
  fetchChatsError: null,
  fetchMessagesError: null
}

const actions = {

  [FETCH_CHATS]({ commit }) {
    chatApi
      .fecthChats()
      .then(res => {
        commit(SET_CHATS, res.data)
      })
      .catch(e => {
        commit(SET_FETCH_CHATS_ERROR, e)
      })
  },

  [FETCH_MESSAGES]({ commit }, chatId) {
    messageApi
      .fecthMessages(chatId)
      .then(res => {
        commit(SET_MESSAGES, res.data)
      })
      .catch(e => {
        commit(SET_FETCH_MESSAGES_ERROR, e)
      })
  }
}

const mutations = {

  [SET_CHATS] (state, chats) {
    state.chats = chats
  },

  [SET_MESSAGES] (state, messages) {
    state.messages = messages
  },

  [SET_FETCH_CHATS_ERROR] (state, e) {
    state.fetchChatsError = e
  },

  [SET_FETCH_MESSAGES_ERROR] (state, e) {
    state.fetchMessagesError = e
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
