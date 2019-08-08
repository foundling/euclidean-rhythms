<template>
  <div class="sequencer-controls">
    <button @click="incrementRotation">rotation: {{ rotation }}</button>
    <i 
    @click="reverseDirection('counter-clockwise')" 
    :class="{'selected': direction === 'counter-clockwise'}"
    class="far fa-arrow-alt-circle-left" />
    <i 
    @click="reverseDirection('clockwise')" 
    :class="{'selected': direction === 'clockwise'}"
    class="far fa-arrow-alt-circle-right" />
  </div>
</template>

<style lang="scss" scoped>
  .sequencer-controls {
    .selected {
      background: red;
      color: white;
    }
  }
</style>

<script>
  export default {
    name: 'SequencerControls',
    props: {
      rotation: {
        type: Number,
        required: true
      },
      direction: {
        type: String,
        default: 'clockwise'
      }
    },
    methods: {
      incrementRotation() {
        this.$emit('sequencer-controls-rotated', this.rotation + 1)
      },
      reverseDirection(direction) {
        this.$emit('sequencer-controls-direction-changed', direction) 
      } 
    }
  }
</script>


