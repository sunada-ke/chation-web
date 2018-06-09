<template>
    <div class="home">
      <v-layout row>
        <v-flex xs0 sm3 order-xs1 class="chats-container">
          <rooms></rooms>
        </v-flex>
        <v-flex sm9 order-xs2>
          <chats></chats>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
import Rooms from './Rooms'
import Chats from './Chats'

export default {
  name: 'Home',

  components: {
    Rooms,
    Chats
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

.chats-container {
  overflow-y: auto;
  height: calc(100vh - 64px);
  border-right: solid 1px gainsboro
}

</style>
