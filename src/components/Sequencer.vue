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

    <g 
    v-for="(track, trackIndex) in tracks"
    v-show="trackIndex === activeChannel" 
    :key="trackIndex">

      <circle 
      v-for="(circle, index) in circles" 
      @click.exact="setEditable(index)"
      @click.shift.exact="setEditable(index, true)"
      @keyup.enter="setEditable(index)"
      :tabindex="index + 2"
      :id="`step-${index}`"
      :class="{ 
        'editing': isEditable(index),
        'active-step': index === track.sequence.activeStep,
        'pulse': circle.isPulse, 
        'muted': track.sequence.muted 
      }"
      :cx="circle.cx"
      :cy="circle.cy"
      :key="index"
      r="20" />

    </g>

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
      stepEditIndexes: Array,
      tracks: {
        type: Array
      },
      pulseMode: {
        type: String
      },
      activeChannel: Number
    },
    data: function() {
      return {}
    },
    created() {
      this.sequencer = new Sequencer({
        activeChannel: this.activeChannel,
        audioContext: new (window.AudioContext || AudioContext),
        tracks: this.tracks,
      }).init()
    },
    methods: {
      isEditable(index) {
        return this.tracks[this.activeChannel].sequence.get(index) && this.stepEditIndexes.includes(index)
      },
      setEditable(index, multiple=false) {
        this.$emit('sequencer-step-edit-index-update', index, multiple)
      },
      updatePulseCount() {
        this.$emit('pulse-count-updated', { 
          pulseMode: this.pulseMode,
          activeChannel: this.activeChannel 
        }) 
      }
    },
    computed: {
      circles() {
        const radius = 160
        const offsetAngle = 90
        const centerCoords = { x: 200, y: 200 }
        const { sequence } = this.tracks[this.activeChannel]
        const radiansPerCircle = 360.0/sequence.n

        return range(sequence.n).map(index => radiansPerCircle * index)
          .map((radians, index) => ({
            isPulse: sequence.get(index),
            cx: radius * Math.cos(degreesToRadians(radians - offsetAngle)) + centerCoords.x,
            cy: radius * Math.sin(degreesToRadians(radians - offsetAngle)) + centerCoords.y
          }))
      }
    },
    watch: {
    }
  }

</script>
