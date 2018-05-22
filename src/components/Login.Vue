<template>
    <div>
    </div>
</template>

<script>
import { LOGIN } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('login')

export default {
  name: 'Login',

  mounted: function() {
    this.login()
  },

  methods: {
    ...mapActions({
      login: LOGIN
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
