<template>
  <div class="sequencer-controls">
    <button @click="incrementRotation">rotation: {{ rotation }}</button>
    <i 
    @click="reverseDirection('counter-clockwise')" 
    :class="{
      'selected': direction === 'counter-clockwise',
      'fas fa-arrow-alt-circle-left': direction === 'counter-clockwise',
      'far fa-arrow-alt-circle-left': direction === 'clockwise'
    }"/>
    <i 
    @click="reverseDirection('clockwise')" 
    :class="{
      'selected': direction === 'clockwise',
      'fas fa-arrow-alt-circle-right': direction === 'clockwise',
      'far fa-arrow-alt-circle-right': direction === 'counter-clockwise'
    }"/>
  </div>
</template>

<style lang="scss" scoped>
  .sequencer-controls {
    color: lightgray;
    .selected {
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
        if (direction !== this.direction)
          this.$emit('sequencer-controls-direction-changed', direction) 
      } 
    }
  }
</script>


