<template>
    <div class="home">
    <v-layout row>
      <v-flex xs0 sm3 order-xs1 class="chats-container">
        <v-list two-line>
          <template v-for="item in talks">
            <v-list-tile
              :key="item.title"
              ripple
              avatar
              @click="onItemClick"
            >
              <v-list-tile-avatar>
                <img :src="require('../assets/waiter.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-text="item.message" class="text--primary"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.time }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
      <v-flex sm9 order-xs2>
        <chat></chat>
      </v-flex>
    </v-layout>
    </div>
</template>

<script>
import Chat from './Chat'
import virtualList from 'vue-virtual-scroll-list'

export default {
  name: 'Home',
  components: {
    Chat,
    'virtual-list': virtualList
  },
  data() {
    return {
      talks: [
        {
          title: 'A',
          message: 'HelloHelloHelloHelloHelloHelloHelloHello!',
          time: '13:25'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'B',
          message: 'Hello!',
          time: '12:00'
        },
        {
          title: 'C',
          message: 'Hello!',
          time: '12:00'
        }
      ]
    }
  },
  methods: {
    onItemClick () {
      console.log('onItemClick')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* .chats {
  padding: 0;
} */

.chats-container {
  overflow-y: auto;
  height: calc(100vh - 64px);
  border-right: solid 1px gainsboro
}

</style>
