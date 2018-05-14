<template>
  <div class="chat-container">
    <div class="message-container">
      <v-list dark two-line class="message">
        <template v-for="item in messages">
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
    </div>
    <div class="sendbox">
      <input type="text" placeholder="Message" class="input" v-on:keyup.enter="sendMessage">
      <v-btn icon class="blue--text">
        <v-icon>send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      messages: [
        {
          title: 'A',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'B',
          subtitle: 'I send a message.'
        },
        {
          title: 'C',
          subtitle: 'I send a message.'
        }
      ]
    }
  }
}
</script>

<style scoped>

.message-container {
  box-sizing: border-box;
  height: calc(100vh - 64px - 70px);
  overflow-y: auto;
}

.message {
  /* background-color:#fff; */
}

.sendbox {
  box-sizing: border-box;
  height: 70px;
  bottom: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: #fff;
}

.input {
  flex-grow: 1;
  padding: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
}

@media (max-width: 480px) {
  .message-container .content{
    max-width: 60%;
  }
}

</style>
