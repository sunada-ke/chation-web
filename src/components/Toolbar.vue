<template>
  <v-toolbar dark height="64x" color="primary">
    <v-toolbar-title class="white--text">
      {{ $t("title") }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-on:click="logout" icon>
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { LOGOUT } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('toolbar')

export default {
  name: 'Toolbar',

  computed: mapState({
    loggedOut: 'loggedOut'
  }),

  watch: {
    loggedOut() {
      if (this.loggedOut) this.$router.push({ name: 'login' })
    }
  },

  methods: {
    ...mapActions({
      logout: LOGOUT
    })
  }
}
</script>

<style scoped>
.toolbar__content {
    height: 48px;
}
</style>
