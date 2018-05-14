<template>
  <v-toolbar dark height="64x" color="primary">
    <v-toolbar-title class="white--text">
      {{ $t("title") }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.toolbar__content {
    height: 48px;
}
</style>
