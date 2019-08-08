<template>
  <div class="sequencer-controls">
    <i @click="reverseDirection('counter-clockwise')" class="far fa-arrow-alt-circle-left" />
    <i @click="reverseDirection('clockwise')" class="far fa-arrow-alt-circle-right" />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'SequencerControls',
    methods: {
      reverseDirection(direction) {
        this.$emit('sequencer-controls-direction-changed', direction) 
      } 
    }
  }
</script>


