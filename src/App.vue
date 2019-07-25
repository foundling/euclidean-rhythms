<template>

  <div id="app">
    <Sequencer :steps="8" />
  </div>

</template>
<script>

  import Sequencer from './components/Sequencer.vue'

  export default {
    name: 'app',
    components: {
      Sequencer
    }
  }

</script>
