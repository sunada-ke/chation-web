<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
        <v-progress-circular :size="70" indeterminate color="primary"></v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
import { SAVE_TOKENS } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('signin')

export default {
  name: 'AuthCallback',
  mounted () {
    this.saveToken()
  },
  computed: mapState({
    authenticated: state => state.authenticated
  }),
  watch: {
    authenticated() {
      this.$router.push({ name: 'home' })
    }
  },
  methods: {
    ...mapActions({
      saveToken: SAVE_TOKENS
    })
  }
}
</script>
