<template>
    <div>
    </div>
</template>

<script>
import { SIGN_IN } from '../vuex/action-types'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('signin')

export default {
  name: 'SignIn',
  mounted: function() {
    this.signin()
  },
  methods: {
    ...mapActions({
      signin: SIGN_IN
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
