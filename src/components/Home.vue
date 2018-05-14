<template>
    <div class="home">
    <v-layout row>
      <v-flex sm3 order-xs1 class="chats-container">
        <v-list two-line>
          <template v-for="item in talks">
            <v-list-tile avatar :key="item.title" @click="aaa">
              <v-list-tile-avatar>
                <img :src="require('../assets/user_awake.png')">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
      <v-flex xs12 sm9 order-xs2>
        <chat></chat>
      </v-flex>
    </v-layout>
    </div>
</template>

<script>
import Chat from './Chat'

export default {
  name: 'Home',
  components: {
    Chat
  },
  data() {
    return {
      talks: [
        {
          title: 'A',
          subtitle: 'Hello!'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'B',
          subtitle: 'Hello！'
        },
        {
          title: 'C',
          subtitle: 'Hello！'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.chats-container {
  overflow-y: auto;
  height: calc(100vh - 64px);
}

</style>
