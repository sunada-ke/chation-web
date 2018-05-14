<template>
    <v-app>
      <toolbar></toolbar>
      <main>
        <router-view></router-view>
      </main>
    </v-app>
</template>

<script>
import Toolbar from './components/Toolbar'

export default {
  name: 'App',
  components: {
    Toolbar
  }
}
</script>
