<template>
    <div class="home">
      <v-layout row>
        <v-flex xs0 sm3 order-xs1 class="chats-container">
          <room></room>
        </v-flex>
        <v-flex sm9 order-xs2>
          <chat></chat>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
import Room from './Room'
import Chat from './Chat'

export default {
  name: 'Home',

  components: {
    Room,
    Chat
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.chats-container {
  overflow-y: auto;
  height: calc(100vh - 64px);
  border-right: solid 1px gainsboro
}

</style>
