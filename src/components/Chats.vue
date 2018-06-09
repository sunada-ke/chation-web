<template>
  <v-list two-line class="chats-container">
    <template v-for="item in chats">
      <v-list-tile :key="item.title" ripple avatar @click="onItemClick(item.id)">
        <v-list-tile-avatar>
          <img :src="require('../assets/waiter.png')">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.name"></v-list-tile-title>
          <v-list-tile-sub-title v-text="item.message"></v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text>{{ item.sendAt | moment('HH:mm') }}</v-list-tile-action-text>
        </v-list-tile-action>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
import { FETCH_CHATS, FETCH_MESSAGES } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
import toast from '../util/toast'

const { mapActions, mapState } = createNamespacedHelpers('chat')

export default {
  name: 'Chats',

  mounted () {
    this.fetchChats()
  },

  computed: mapState({
    chats: 'chats',
    fetchChatsError: 'fetchChatsError'
  }),

  watch: {
    fetchChatsError(e) {
      toast.showFailed()
    }
  },

  methods: {
    ...mapActions({
      fetchChats: FETCH_CHATS,
      fetchMessages: FETCH_MESSAGES
    }),

    onItemClick (chatId) {
      this.fetchMessages(chatId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.chats-container {
  overflow-y: auto;
  height: 100vh;
  border-right: solid 1px gainsboro
}

</style>
