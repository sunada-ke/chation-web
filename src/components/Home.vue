<template>
    <div class="home">
      <v-layout row>
        <v-flex xs0 sm3 order-xs1>
          <chats></chats>
        </v-flex>
        <v-flex sm9 order-xs2>
          <chat></chat>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
import Chats from './Chats'
import Chat from './Chat'

export default {
  name: 'Home',

  components: {
    Chats,
    Chat
  }
}
</script>
