<template>

  <div id="app">
    <Sequencer 
      :initial-tempo="140"
      :steps="8" 
      :pulses="3" />
  </div>

</template>
<script>

  import Sequencer from './components/Sequencer.vue'

  export default {
    name: 'app',
    components: { Sequencer }
  }

</script>
