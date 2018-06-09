import Vue from 'vue'

export default {

  showFailed() {
    this.showError('Failed.')
  },

  show(msg) {
    Vue.toasted.show(msg)
  },

  showError(msg) {
    Vue.toasted.error(msg)
  }
}
