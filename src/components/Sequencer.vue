<template>
  <svg width="100%" height="100%">
    <circle 
      fill="black" 
      cy="10" 
      :cx="(100 * index) + 10" 
      r="10"
      v-for="(step, index) in steps" 
      :key="index">
    </circle>
  </svg>
</template>

<script>

import Sequencer from '../lib/Sequencer'

const sequencer = new Sequencer({
  audioContext: new (window.AudioContext || AudioContext) 
})

sequencer.init()

export default {
  name: 'Sequencer',
  data: function() {
    return {
      steps: [1,2,3,4]
    }
  }
}
</script>

<style scoped>
</style>
