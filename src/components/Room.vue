<template>
  <v-list two-line>
    <template v-for="item in rooms">
      <v-list-tile :key="item.title" ripple avatar @click="onItemClick">
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
import { FETCH_ROOMS } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
import toast from '../util/toast'

const { mapActions, mapState } = createNamespacedHelpers('chat')

export default {
  name: 'Rooms',

  mounted () {
    this.fetchRooms()
  },

  computed: mapState({
    rooms: 'rooms',
    fetchRoomsError: 'fetchRoomsError'
  }),

  watch: {
    fetchRoomsError(e) {
      toast.showFailed()
    }
  },

  methods: {
    ...mapActions({
      fetchRooms: FETCH_ROOMS
    }),

    onItemClick () {
      console.log('onItemClick')
    }
  }
}
</script>
