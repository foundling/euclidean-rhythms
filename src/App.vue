<template>
  <div id="app">
    <Sequencer 
      :track-count="4"
      :initial-tempo="100"
      :steps="8"
      :pulses="0" />
  </div>
</template>

<script>

  import Sequencer from './components/Sequencer.vue'

  export default {
    name: 'app',
    components: { Sequencer }
  }

</script>
