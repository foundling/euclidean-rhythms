<style lang="scss" scoped>
  @import "../assets/scss/colors.scss";

  .sequencer {
    background: $gray-medium;
    width: 100%; 
    height: 100%;

    circle {
      fill: scale-color($track-1, $lightness: 90%);

      &:focus {
        outline: none;
      }

      &.pulse.active-step {
        fill: white;
        stroke: scale-color($track-1, $lightness: 10%);
        stroke-width: 3;
      } 

      &.active-step {
        stroke: $red;
        stroke-width: 3;
        stroke: scale-color($track-1, $lightness: 10%);
      }

      &.editing {
        stroke: $red;
        stroke-width: 3px;
      }

      &.pulse.track {
        fill: $track-1;
      }

      &.pulse {
        fill: $track-1;
      }

      &.step {
        fill: black;
      }

      &.center {
        stroke: white;
        stroke-width: 3;
        fill: black;
      }
    }
  }
</style>

<template>
  <svg 
    class="sequencer"
    width="100%" 
    height="100%">
  
    <circle
      @click="updatePulseCount"
      @keyup.enter="updatePulseCount"
      tabindex="1"
      class="center"
      cx="200"
      cy="200"
      r="20" />
 
    <slot></slot>

  </svg>
</template>

<script>

  import { range } from '../lib/utils'
  import { ER, degreesToRadians } from '../lib/equations'
  import Sequencer from '../lib/Sequencer'
  import Synth from '../lib/Synth'

  export default {
    name: 'Sequencer',
    components: {},
    props: {
      tracks: {
        type: Array
      },
      pulseMode: {
        type: String
      },
      activeChannel: Number
    },
    data: function() {
      return {
        ui: { activeStep: null }
      }
    },
    created() {
      // init sequencer here
      /*
      this.sequencer = new Sequencer({
        audioContext: new (window.AudioContext || AudioContext),
        trackIndex: this.activeChannel,
        tracks: this.tracks,
        ui: this.ui
      }).init()
      */
    },
    methods: {
      updatePulseCount() {
        this.$emit('pulse-count-updated', { 
          pulseMode: this.pulseMode,
          activeChannel: this.activeChannel 
        }) 
      }
    },
    computed: {
    },
    watch: {
    }
  }

</script>
